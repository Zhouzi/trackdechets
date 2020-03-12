import { ErrorCode } from "../../../common/errors";
import { markAsSealed } from "../mark-as";
import { getNewValidForm } from "../__mocks__/data";
import { flattenObjectForDb } from "../../form-converter";
import * as companiesHelpers from "../../../companies/queries/userCompanies";
import { formSchema } from "../../validator";
import { unflattenObjectFromDb } from "../../form-converter";
describe("Forms -> markAsSealed mutation", () => {
  const prisma = {
    form: jest.fn(() => Promise.resolve({})),
    updateForm: jest.fn(() => Promise.resolve({})),
    createForm: jest.fn(() => Promise.resolve({})),
    createStatusLog: jest.fn(() => Promise.resolve({})),
    updateManyForms: jest.fn(() => Promise.resolve({}))
  };

  const getUserCompaniesMock = jest.spyOn(companiesHelpers, "getUserCompanies");

  const defaultContext = {
    prisma,
    user: { id: "userId" },
    request: null
  } as any;

  beforeEach(() => {
    Object.keys(prisma).forEach(key => prisma[key].mockClear());
    getUserCompaniesMock.mockReset();
  });

  it("should fail when form is not fully valid", async () => {
    expect.assertions(1);
    try {
      const form = getNewValidForm();
      // unvalidate form
      form.emitter.company.address = null;

      getUserCompaniesMock.mockResolvedValue([
        { siret: form.emitter.company.siret } as any
      ]);
      prisma.form.mockResolvedValue(flattenObjectForDb(form));

      await markAsSealed(null, { id: 1 }, defaultContext);
    } catch (err) {
      expect(err.extensions.code).toBe(ErrorCode.BAD_USER_INPUT);
    }
  });

  it("should display the validation error when the form has an invalid field", async () => {
    expect.assertions(1);
    try {
      const form = getNewValidForm();
      // unvalidate form
      form.emitter.company.siret = "";

      getUserCompaniesMock.mockResolvedValue([
        { siret: form.emitter.company.siret } as any
      ]);
      prisma.form.mockResolvedValue(flattenObjectForDb(form));

      await markAsSealed(null, { id: 1 }, defaultContext);
    } catch (err) {
      const errMess =
        `Erreur, impossible de sceller le bordereau car des champs obligatoires ne sont pas renseignés.\n` +
        `Erreur(s): Émetteur: La sélection d'une entreprise par SIRET est obligatoire`;

      expect(err.message).toBe(errMess);
    }
  });

  it("should display all validation errors if there are many", async () => {
    try {
      const form = getNewValidForm();
      // unvalidate form
      form.emitter.company.siret = "";
      form.emitter.company.address = "";

      getUserCompaniesMock.mockResolvedValue([
        { siret: form.emitter.company.siret } as any
      ]);
      prisma.form.mockResolvedValue(flattenObjectForDb(form));

      await markAsSealed(null, { id: form.id }, defaultContext);
    } catch (err) {
      const errMess =
        `Erreur, impossible de sceller le bordereau car des champs obligatoires ne sont pas renseignés.\n` +
        `Erreur(s): Émetteur: La sélection d'une entreprise par SIRET est obligatoire\n` +
        `Émetteur: L'adresse d'une entreprise est obligatoire`;

      expect(err.message).toBe(errMess);
    }
  });

  it("should fail when SEALED is not a possible next step", async () => {
    expect.assertions(1);
    try {
      getUserCompaniesMock.mockResolvedValue([{ siret: "any siret" } as any]);
      prisma.form.mockResolvedValue({ id: 1, status: "SENT" });

      await markAsSealed(null, { id: 1 }, defaultContext);
    } catch (err) {
      expect(err.extensions.code).toBe(ErrorCode.FORBIDDEN);
    }
  });

  it("should work when form is complete and has no appendix 2", async () => {
    expect.assertions(1);
    const form = getNewValidForm();

    getUserCompaniesMock.mockResolvedValue([
      { siret: form.emitter.company.siret } as any
    ]);
    prisma.form
      .mockReturnValue({
        appendix2Forms: () => Promise.resolve([])
      } as any)
      .mockReturnValueOnce(Promise.resolve(flattenObjectForDb(form)));

    await markAsSealed(null, { id: 1 }, defaultContext);
    expect(prisma.updateForm).toHaveBeenCalledTimes(1);
  });

  it("should work with appendix 2 and mark them as GROUPED", async () => {
    const form = getNewValidForm();

    getUserCompaniesMock.mockResolvedValue([
      { siret: form.emitter.company.siret } as any
    ]);

    prisma.form
      .mockReturnValue({
        appendix2Forms: () => Promise.resolve([{ id: "appendix id" }])
      } as any)
      .mockReturnValueOnce(Promise.resolve(flattenObjectForDb(form)));

    await markAsSealed(null, { id: 1 }, defaultContext);
    expect(prisma.updateForm).toHaveBeenCalledTimes(1);
    expect(prisma.updateManyForms).toHaveBeenCalledWith({
      where: {
        status: "AWAITING_GROUP",
        OR: [{ id: "appendix id" }]
      },
      data: { status: "GROUPED" }
    });
  });
});
