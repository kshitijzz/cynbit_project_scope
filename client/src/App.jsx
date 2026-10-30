import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [projectType, setProjectType] = useState("");
  const [features, setFeatures] = useState([]);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const [estimatedDays, setEstimatedDays] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [liveEstimate, setLiveEstimate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = "https://scopecraft-backend.onrender.com";
  // Calculate the live estimate whenever project type or features change.
  useEffect(() => {
    if (!projectType) {
      setLiveEstimate(null);
      setEstimateError("");
      setEstimateLoading(false);
      return;
    }

    const controller = new AbortController();

    const getEstimate = async () => {
      setEstimateLoading(true);
      setEstimateError("");

      try {
        const response = await axios.post(
          `${API_URL}/api/projects/estimate`,
          {
            projectType,
            features,
          },
          { signal: controller.signal }
        );

        setLiveEstimate(response.data.estimate);
      } catch (error) {
        if (
          error.code !== "ERR_CANCELED" &&
          error.name !== "CanceledError"
        ) {
          setLiveEstimate(null);
          setEstimateError(
            "Unable to calculate estimate. Please check your backend."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setEstimateLoading(false);
        }
      }
    };

    getEstimate();

    return () => controller.abort();
  }, [projectType, features]);

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFeatures((prev) =>
        prev.includes(value) ? prev : [...prev, value]
      );
    } else {
      setFeatures((prev) =>
        prev.filter((feature) => feature !== value)
      );
    }

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleProjectTypeChange = (value) => {
    setProjectType(value);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setEstimatedDays("");
    setBudgetRange("");

    try {
      const response = await axios.post(
        `${API_URL}/api/projects`,
        {
          projectType,
          features,
          clientName: clientName.trim(),
          email: email.trim(),
          description: description.trim(),
        }
      );

      const project = response.data.project;

      setEstimatedDays(project.estimatedDays);
      setBudgetRange(project.budgetRange);
      setSuccessMessage(
        response.data.message ||
          "Project brief submitted successfully!"
      );

      setProjectType("");
      setFeatures([]);
      setClientName("");
      setEmail("");
      setDescription("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to submit your project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const projectTypes = [
    { value: "business-website", label: "Business Website" },
    { value: "ecommerce", label: "E-commerce Website" },
    { value: "web-application", label: "Web Application" },
    { value: "mobile-app", label: "Mobile App" },
  ];

  const availableFeatures = [
    { value: "authentication", label: "User Authentication" },
    { value: "payments", label: "Payment Integration" },
    { value: "adminDashboard", label: "Admin Dashboard" },
    { value: "integrations", label: "Third-party Integrations" },
    { value: "searchFilters", label: "Search & Filters" },
    { value: "notifications", label: "Notifications" },
  ];

  const selectedProject = projectTypes.find(
    (project) => project.value === projectType
  );

  return (
    <div className="container py-4 py-lg-5">
      {/* Page heading */}
      <div className="mb-4">
        <h1 className="fw-bold mb-2">ScopeCraft</h1>
        <p className="text-secondary mb-0">
          Plan your project scope and get an indicative timeline.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="row g-4 align-items-start">
        {/* LEFT SIDE: PROJECT FORM */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Project type */}
                <fieldset className="mb-4">
                  <legend className="fs-5 fw-semibold mb-3">
                    1. Select project type
                  </legend>

                  <div className="row g-3">
                    {projectTypes.map((project) => (
                      <div
                        className="col-12 col-sm-6"
                        key={project.value}
                      >
                        <label
                          className={`form-check border rounded p-3 h-100 ${
                            projectType === project.value
                              ? "border-primary bg-light"
                              : ""
                          }`}
                        >
                          <input
                            className="form-check-input me-2"
                            type="radio"
                            name="projectType"
                            value={project.value}
                            checked={projectType === project.value}
                            onChange={() =>
                              handleProjectTypeChange(project.value)
                            }
                            required
                          />

                          <span className="form-check-label">
                            {project.label}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* Features */}
                <fieldset className="mb-4">
                  <legend className="fs-5 fw-semibold mb-3">
                    2. Choose features
                  </legend>

                  <div className="row g-3">
                    {availableFeatures.map((feature) => (
                      <div
                        className="col-12 col-sm-6"
                        key={feature.value}
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={feature.value}
                            value={feature.value}
                            checked={features.includes(feature.value)}
                            onChange={handleFeatureChange}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={feature.value}
                          >
                            {feature.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <hr className="my-4" />

                {/* Client details */}
                <h2 className="fs-5 fw-semibold mb-3">
                  3. Your details
                </h2>

                <div className="mb-3">
                  <label htmlFor="clientName" className="form-label">
                    Full name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="clientName"
                    name="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Project description
                  </label>

                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project requirements..."
                  />

                  <div className="form-text">
                    Optional. Maximum 2,000 characters.
                  </div>
                </div>

                {/* Feedback messages */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success" role="status">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Project"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: LIVE ESTIMATE */}
        <div className="col-12 col-lg-5">
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ position: "sticky", top: "24px" }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold mb-0">Live Estimate</h2>

                <span className="badge text-bg-success">
                  Live
                </span>
              </div>

              <p className="text-secondary small mb-4">
                Your estimate updates automatically as you choose
                your project type and features.
              </p>

              {!projectType ? (
                <div className="bg-light rounded p-4 text-center">
                  <div className="fs-2 mb-2">↗</div>
                  <p className="fw-semibold mb-1">
                    Start building your estimate
                  </p>
                  <p className="text-secondary small mb-0">
                    Select a project type on the left to see your
                    estimated timeline.
                  </p>
                </div>
              ) : estimateLoading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">
                      Calculating estimate...
                    </span>
                  </div>
                  <p className="text-secondary mb-0">
                    Calculating your estimate...
                  </p>
                </div>
              ) : estimateError ? (
                <div className="alert alert-warning mb-0" role="alert">
                  {estimateError}
                </div>
              ) : liveEstimate ? (
                <>
                  <div className="bg-light rounded p-3 mb-3">
                    <p className="text-secondary small mb-1">
                      Project type
                    </p>
                    <h3 className="h5 fw-bold mb-0">
                      {selectedProject?.label || liveEstimate.projectName}
                    </h3>
                  </div>

                  <div className="border rounded p-3 mb-3">
                    <p className="text-secondary small mb-1">
                      Estimated duration
                    </p>

                    <div className="d-flex align-items-baseline gap-2">
                      <span className="display-5 fw-bold text-primary">
                        {liveEstimate.estimatedDays}
                      </span>
                      <span className="text-secondary">
                        working days
                      </span>
                    </div>
                  </div>

                  <div className="border rounded p-3 mb-3">
                    <p className="text-secondary small mb-1">
                      Project scope
                    </p>
                    <h3 className="h5 fw-bold text-capitalize mb-0">
                      {liveEstimate.budgetRange}
                    </h3>
                  </div>

                  <div className="mb-3">
                    <p className="fw-semibold mb-2">
                      Selected features ({features.length})
                    </p>

                    {features.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {availableFeatures
                          .filter((feature) =>
                            features.includes(feature.value)
                          )
                          .map((feature) => (
                            <span
                              key={feature.value}
                              className="badge rounded-pill text-bg-light border text-dark"
                            >
                              {feature.label}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <p className="text-secondary small mb-0">
                        No additional features selected.
                      </p>
                    )}
                  </div>

                  <div className="alert alert-info small mb-0">
                    This is an indicative planning estimate, not a
                    guaranteed delivery date or monetary quote.
                    Actual timelines depend on requirements and
                    project complexity.
                  </div>
                </>
              ) : (
                <p className="text-secondary mb-0">
                  Your estimate will appear here.
                </p>
              )}
            </div>
          </div>

          {/* Submitted project estimate */}
          {estimatedDays !== "" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-3">
                  Submitted Project Estimate
                </h2>

                <p className="text-secondary small">
                  Estimated duration
                </p>
                <p className="fs-4 fw-bold mb-3">
                  {estimatedDays} working days
                </p>

                <p className="text-secondary small">Project scope</p>
                <p className="fs-5 fw-semibold text-capitalize mb-0">
                  {budgetRange}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
