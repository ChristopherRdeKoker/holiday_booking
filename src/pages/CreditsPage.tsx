import { HomePhoto } from "@/components/HomePhoto";
import { findHome } from "@/data/homes";
import { photoCredits } from "@/data/photoCredits";
import { formatDate } from "@/lib/dates";

export function CreditsPage() {
  return (
    <article className="list-page credits-page">
      <header className="credits-head">
        <h1>Photo credits</h1>
        <p className="muted">
          The homes on Stoep are made up, so no photo shows the actual home. Each listing uses a real South African landscape near, or like, its setting.
          All {photoCredits.length} photos were released into the public domain under CC0 1.0. No credit is required, but the photographers deserve one.
        </p>
      </header>
      <ul className="credit-list">
        {photoCredits.map((credit) => {
          const home = findHome(credit.homeId);
          if (!home) throw new Error(`Photo credit points at unknown home "${credit.homeId}"`);
          const homeName = `${home.title}, ${home.town}`;
          return (
            <li key={credit.homeId} className="credit-item" data-testid="photo-credit" data-photo={credit.homeId}>
              <HomePhoto homeId={credit.homeId} sizes="(min-width: 48rem) 15rem, 100vw" className="credit-photo" />
              <div className="credit-body">
                <h2 className="credit-home">{homeName}</h2>
                <p className="credit-subject">Pictured: {credit.subject}</p>
                <dl className="credit-facts">
                  <div>
                    <dt>Photographer</dt>
                    <dd>{credit.author}</dd>
                  </div>
                  <div>
                    <dt>Licence</dt>
                    <dd>
                      <a href={credit.licenceUrl} rel="noreferrer">
                        {credit.licence}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>
                      <a href={credit.sourcePageUrl} rel="noreferrer">
                        File page on Wikimedia Commons
                      </a>
                      {" and the "}
                      <a href={credit.originalFileUrl} rel="noreferrer">
                        full-size original
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Downloaded</dt>
                    <dd>{formatDate(credit.fetchedOn, { day: "numeric", month: "long", year: "numeric" })}</dd>
                  </div>
                  <div>
                    <dt>Changes made</dt>
                    <dd>{credit.transformation}</dd>
                  </div>
                </dl>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
