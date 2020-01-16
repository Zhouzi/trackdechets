import React from "react";
import AccountFieldApiKey from "./fields/AccountFieldApiKey";

export default function AccountIntegrationApi() {
  return (
    <>
      <div className="notification">
        L'API Trackdéchets permet d'utiliser Trackdéchets via une solution
        informatique tierce (ERP, SaaS déchets, etc). Pour en savoir plus, nous
        vous invitons à consulter{" "}
        <a href="https://doc.trackdechets.fr" target="_blank">
          la documentation
        </a>
      </div>
      <AccountFieldApiKey />
    </>
  );
}
