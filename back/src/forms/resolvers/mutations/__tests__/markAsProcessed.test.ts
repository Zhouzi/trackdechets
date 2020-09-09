import { getNewValidPrismaForm } from "../__mocks__/data";
import { markAsProcessedFn as markAsProcessed } from "../markAsProcessed";

const temporaryStorageDetailMock = jest.fn(() => Promise.resolve(null));
const formMock = jest.fn(() => Promise.resolve({}));
function mockFormWith(value) {
  const result: any = Promise.resolve(value);
  result.temporaryStorageDetail = temporaryStorageDetailMock;
  formMock.mockReturnValue(result);
}

const prisma = {
  form: formMock,
  updateForm: jest.fn((..._args) => Promise.resolve({})),
  createForm: jest.fn(() => Promise.resolve({})),
  createStatusLog: jest.fn(() => Promise.resolve({})),
  updateManyForms: jest.fn(() => Promise.resolve({}))
};

jest.mock("../../../../generated/prisma-client", () => ({
  prisma: {
    form: () => prisma.form(),
    updateForm: (...args) => prisma.updateForm(...args),
    createForm: () => prisma.createForm(),
    createStatusLog: () => prisma.createStatusLog(),
    updateManyForms: () => prisma.updateManyForms()
  }
}));

const defaultContext = {
  prisma,
  user: { id: "userId" },
  request: null
} as any;

describe("Forms -> markAsProcessed mutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("set status to NoTraceability if actor is exempt of traceability", async () => {
    const form = getNewValidPrismaForm();
    form.status = "RECEIVED";

    mockFormWith(form);

    await markAsProcessed(
      form,
      {
        id: "1",
        processedInfo: {
          noTraceability: true,
          processingOperationDone: "R 1",
          processedBy: "John Snow",
          processedAt: "2019-12-20T00:00:00.000Z"
        }
      },
      defaultContext
    );
    expect(prisma.updateForm).toHaveBeenCalledTimes(1);
    expect(prisma.updateForm).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          noTraceability: true,
          status: "NO_TRACEABILITY"
        })
      })
    );
  });

  it("set status to AwaitsGroup if processing operation says so", async () => {
    const form = getNewValidPrismaForm();
    form.status = "RECEIVED";

    mockFormWith(form);

    await markAsProcessed(
      form,
      {
        id: "1",
        processedInfo: {
          processingOperationDone: "D 14",
          processedBy: "John Snow",
          processedAt: "2019-12-20T00:00:00.000Z",
          nextDestination: {
            processingOperation: "R 1",
            company: {
              siret: "65714526789851",
              address: "9 rue de la destination ultérieure",
              country: "FR",
              name: "Destination ultérieure",
              contact: "Arya Stark",
              mail: "arya.stark@trackdechets.fr",
              phone: "0000000000"
            }
          }
        }
      },
      defaultContext
    );
    expect(prisma.updateForm).toHaveBeenCalledTimes(1);
    expect(prisma.updateForm).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          processingOperationDone: "D 14",
          status: "AWAITING_GROUP"
        })
      })
    );
  });

  it("set status to Processed", async () => {
    const form = getNewValidPrismaForm();
    form.status = "RECEIVED";

    mockFormWith(form);

    await markAsProcessed(
      form,
      {
        id: "1",
        processedInfo: {
          processingOperationDone: "R 1",
          processedBy: "John Snow",
          processedAt: "2019-12-20T00:00:00.000Z"
        }
      },
      defaultContext
    );
    expect(prisma.updateForm).toHaveBeenCalledTimes(1);
    expect(prisma.updateForm).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PROCESSED" })
      })
    );
  });
});
