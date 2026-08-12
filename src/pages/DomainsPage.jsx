import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import DomainCard from "../components/DomainCard";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import { fetchDomains } from "../services/interviewApi";
import { toApiError } from "../services/api";
import { useSelection } from "../context/SelectionContext";

export default function DomainsPage() {
  const [domains, setDomains] = useState(null);
  const [error, setError] = useState(null);
  const { setSelectedDomain } = useSelection();
  const navigate = useNavigate();

  const load = () => {
    setError(null);
    setDomains(null);
    fetchDomains()
      .then(setDomains)
      .catch((err) => setError(toApiError(err)));
  };

  useEffect(load, []);

  const handleSelect = (domain) => {
    setSelectedDomain(domain);
    navigate("/interview/setup");
  };

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-dim">Step 1 of 2</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Interview domains
        </h1>
        <p className="mt-2 max-w-xl text-paper-muted">
          Pick the track closest to the role you're preparing for. You can
          adjust difficulty and length on the next screen.
        </p>

        <div className="mt-10">
          {error && <ErrorMessage code={error.code} message={error.error} onRetry={load} />}
          {!error && !domains && <LoadingState message="Loading domains..." />}
          {domains && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain) => (
                <DomainCard key={domain.slug} domain={domain} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
