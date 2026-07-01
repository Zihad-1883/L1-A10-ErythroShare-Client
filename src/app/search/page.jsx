"use client";
import React, { useState, useMemo } from "react";
import districtsData from "@/data/district.json";
import upazilasData from "@/data/upazila.json";
import { serverQuery } from "@/lib/actions/server";

/* ─── tiny inline styles so we don't need a CSS file ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .search-page * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

  /* hero gradient */
  .search-hero {
    background: linear-gradient(135deg, #0f0505 0%, #1a0404 40%, #2d0707 70%, #450a0a 100%);
    position: relative;
    overflow: hidden;
  }
  .search-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,38,38,0.25) 0%, transparent 70%);
    pointer-events: none;
  }
  .search-hero::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%);
    top: -200px; right: -150px;
    pointer-events: none;
  }

  /* floating blood drop bg icon */
  .hero-blob {
    position: absolute;
    bottom: -40px; left: -60px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  /* pulse ring on hero icon */
  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  .pulse-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid rgba(239,68,68,0.4);
    animation: pulse-ring 2s ease-out infinite;
  }
  .pulse-ring-2 {
    position: absolute;
    inset: -16px;
    border-radius: 50%;
    border: 2px solid rgba(239,68,68,0.2);
    animation: pulse-ring 2s ease-out 0.5s infinite;
  }

  /* search form card */
  .search-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 32px;
  }

  /* select dropdowns */
  .search-select {
    width: 100%;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: #f9fafb;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .search-select:focus {
    border-color: #ef4444;
    background: rgba(255,255,255,0.1);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
  }
  .search-select option {
    background: #1a0404;
    color: #f9fafb;
  }
  .search-select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .select-wrapper {
    position: relative;
  }
  .select-wrapper::after {
    content: '';
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 8px;
    border-right: 2px solid rgba(239,68,68,0.8);
    border-bottom: 2px solid rgba(239,68,68,0.8);
    transform: translateY(-65%) rotate(45deg);
    pointer-events: none;
  }

  /* search button */
  .search-btn {
    width: 100%;
    padding: 15px;
    border-radius: 14px;
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    color: white;
    font-weight: 700;
    font-size: 15px;
    border: none;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
    box-shadow: 0 4px 20px rgba(220,38,38,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .search-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(220,38,38,0.5);
  }
  .search-btn:active:not(:disabled) { transform: scale(0.98); }
  .search-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* results section */
  .results-area {
    background: #f8f7f7;
    min-height: 100vh;
    padding: 48px 24px;
  }

  /* donor card */
  .donor-card {
    background: white;
    border-radius: 20px;
    border: 1px solid #f3e8e8;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .donor-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(220,38,38,0.12);
  }
  .donor-card-accent {
    height: 5px;
    background: linear-gradient(90deg, #dc2626, #7f1d1d);
  }
  .donor-avatar {
    width: 68px; height: 68px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 0 0 3px rgba(220,38,38,0.2);
    flex-shrink: 0;
  }
  .blood-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #dc2626, #991b1b);
    color: white;
    font-weight: 800;
    font-size: 18px;
    width: 52px; height: 52px;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(220,38,38,0.3);
    letter-spacing: 0.5px;
  }

  /* skeleton loader */
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 8px;
  }

  /* no results */
  .no-results-icon {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }

  /* label */
  .field-label {
    display: block;
    color: rgba(255,255,255,0.65);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  /* stats bar */
  .stats-bar {
    display: flex; gap: 32px; justify-content: center;
    padding: 20px 0 8px;
  }
  .stat-item { text-align: center; }
  .stat-num { font-size: 28px; font-weight: 900; color: #ef4444; line-height: 1; }
  .stat-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }

  /* section heading */
  .results-heading {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .result-count-badge {
    background: linear-gradient(135deg, #dc2626, #991b1b);
    color: white;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 14px;
    border-radius: 99px;
  }

  @media (max-width: 768px) {
    .search-card { padding: 20px; }
    .grid-4 { grid-template-columns: 1fr !important; }
    .stats-bar { gap: 20px; }
  }
`;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SkeletonCard = () => (
  <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #f3e8e8" }}>
    <div style={{ height: 5, background: "#f0f0f0" }} />
    <div style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 68, height: 68, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 18, width: "70%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: "50%" }} />
        </div>
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14 }} />
      </div>
      <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: 14, display: "flex", justifyContent: "space-between" }}>
        <div className="skeleton" style={{ height: 14, width: "40%" }} />
        <div className="skeleton" style={{ height: 14, width: "25%" }} />
      </div>
    </div>
  </div>
);

const SearchPage = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const districts = districtsData[2].data;
  const upazilas = upazilasData[2].data;

  const selectedDistrictId = useMemo(
    () => districts.find((d) => d.name === selectedDistrict)?.id,
    [selectedDistrict, districts]
  );

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrictId) return [];
    return upazilas.filter((u) => u.district_id === selectedDistrictId);
  }, [selectedDistrictId, upazilas]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(false); // hide results while fetching
    setSearchResults([]);

    try {
      const queryParams = new URLSearchParams();
      if (bloodGroup) queryParams.append("bloodGroup", bloodGroup);
      if (selectedDistrict) queryParams.append("district", selectedDistrict);
      if (selectedUpazila) queryParams.append("upazila", selectedUpazila);

      const response = await serverQuery(`/dashboard/all-users?${queryParams.toString()}`);

      const sourceArr = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const filteredList = sourceArr.filter((user) => {
        const matchBlood = bloodGroup ? user.bloodGroup === bloodGroup : true;
        const matchDistrict = selectedDistrict ? user.district === selectedDistrict : true;
        const matchUpazila = selectedUpazila ? user.upazila === selectedUpazila : true;
        return matchBlood && matchDistrict && matchUpazila && user.role !== "admin" && user.status === "active";
      });

      setSearchResults(filteredList);
    } catch (error) {
      console.error("Search failed", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true); // only show results AFTER loading is done
    }
  };

  return (
    <div className="search-page">
      <style>{styles}</style>

      {/* ── HERO + SEARCH ── */}
      <div className="search-hero" style={{ padding: "72px 24px 80px" }}>
        <div className="hero-blob" />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div className="pulse-ring" />
              <div className="pulse-ring-2" />
              <div
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(220,38,38,0.5)",
                  position: "relative", zIndex: 1,
                }}
              >
                {/* blood drop */}
                <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 2 12 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "white", lineHeight: 1.1, margin: 0 }}>
              Find a <span style={{ color: "#f87171" }}>Blood Donor</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
              Search thousands of active donors by blood group and location. Every search could save a life.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            {[["A+", "Most Common"], ["O-", "Universal"], ["AB+", "Universal"], ["B+", "Common"]].map(([bg, desc]) => (
              <div className="stat-item" key={bg}>
                <div className="stat-num">{bg}</div>
                <div className="stat-label">{desc}</div>
              </div>
            ))}
          </div>

          {/* Search card */}
          <div className="search-card" style={{ marginTop: 40 }}>
            <form
              onSubmit={handleSearch}
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}
              className="grid-4"
            >
              {/* Blood Group */}
              <div>
                <label className="field-label">Blood Group</label>
                <div className="select-wrapper">
                  <select
                    className="search-select"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Any Group</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District */}
              <div>
                <label className="field-label">District</label>
                <div className="select-wrapper">
                  <select
                    className="search-select"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedUpazila("");
                    }}
                  >
                    <option value="">Any District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upazila */}
              <div>
                <label className="field-label" style={{ opacity: !selectedDistrict ? 0.4 : 1 }}>Upazila</label>
                <div className="select-wrapper">
                  <select
                    className="search-select"
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Any Upazila</option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button className="search-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner" />
                      Searching…
                    </>
                  ) : (
                    <>
                      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                      </svg>
                      Search Donors
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div style={{ background: "#f8f7f7", padding: "48px 24px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Skeleton while loading */}
          {loading && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div className="skeleton" style={{ height: 24, width: 180 }} />
                <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 99 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
              </div>
            </>
          )}

          {/* Results after search */}
          {!loading && hasSearched && (
            <>
              <div className="results-heading">
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>
                  {searchResults.length > 0 ? "Matching Donors" : "Search Results"}
                </h2>
                <span className="result-count-badge">
                  {searchResults.length} {searchResults.length === 1 ? "donor" : "donors"} found
                </span>
              </div>

              {searchResults.length === 0 ? (
                /* ── No Results ── */
                <div
                  style={{
                    background: "white",
                    borderRadius: 24,
                    border: "1px solid #f3e8e8",
                    padding: "64px 24px",
                    textAlign: "center",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="no-results-icon">
                    <svg width="36" height="36" fill="none" stroke="#dc2626" strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                      <path d="M8 11h6M11 8v6" strokeLinecap="round" opacity="0.4" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", margin: "0 0 10px" }}>
                    No donors found
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 380, margin: "0 auto 28px" }}>
                    We couldn&apos;t find any active donors matching your criteria. Try broadening your search filters.
                  </p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                      { label: "Try any blood group", action: () => setBloodGroup("") },
                      { label: "Try any district", action: () => { setSelectedDistrict(""); setSelectedUpazila(""); } },
                    ].map((tip) => (
                      <button
                        key={tip.label}
                        onClick={tip.action}
                        style={{
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          color: "#dc2626",
                          fontWeight: 600,
                          fontSize: 13,
                          padding: "8px 18px",
                          borderRadius: 99,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#fee2e2")}
                        onMouseLeave={(e) => (e.target.style.background = "#fef2f2")}
                      >
                        {tip.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Donor Cards ── */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                  {searchResults.map((donor) => (
                    <div key={donor._id || donor.id} className="donor-card">
                      <div className="donor-card-accent" />
                      <div style={{ padding: "20px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <img
                            className="donor-avatar"
                            src={
                              donor.image ||
                              donor.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name || "D")}&background=dc2626&color=fff&bold=true`
                            }
                            alt={donor.name}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 17, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {donor.name}
                            </h3>
                            <p style={{ color: "#6b7280", fontSize: 13, margin: "5px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {[donor.upazila, donor.district].filter(Boolean).join(", ")}
                            </p>
                          </div>
                          <div className="blood-badge">{donor.bloodGroup}</div>
                        </div>

                        {/* Status */}
                        <div
                          style={{
                            marginTop: 16,
                            paddingTop: 14,
                            borderTop: "1px solid #fef2f2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              background: "#f0fdf4", color: "#15803d",
                              fontSize: 12, fontWeight: 600,
                              padding: "4px 12px", borderRadius: 99,
                              border: "1px solid #bbf7d0",
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                            Active Donor
                          </span>
                          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
                            {donor.district}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Initial state (no search yet) */}
          {!loading && !hasSearched && (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth={1.8} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>
                Start your search
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                Select your filters above and click &quot;Search Donors&quot; to find active donors near you.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchPage;
