import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { scheduleService } from "../../services/scheduleService";
import { formatDate } from "../../utils/formatDate";

const frequencyLabels = { weekly: "Every week", biweekly: "Every 2 weeks", monthly: "Every month" };

const MySchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSchedules = () => {
    setLoading(true);
    scheduleService.mySchedules()
      .then((response) => setSchedules(response.data))
      .catch(() => setError("Could not load schedules"))
      .finally(() => setLoading(false));
  };

  useEffect(loadSchedules, []);

  const act = async (fn, successMessage) => {
    setMessage("");
    setError("");
    try {
      const response = await fn();
      setMessage(response.data.message || successMessage);
      loadSchedules();
    } catch (err) {
      setError(err.response?.data?.message || successMessage);
    }
  };

  const removeSchedule = (id) => {
    if (!window.confirm("Delete this schedule? Future pickups already generated are kept.")) return;
    act(() => scheduleService.remove(id), "Schedule deleted.");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Pickup Schedules</h1>
        <Link className="btn btn-cleantrack" to="/customer/schedules/new">New Schedule</Link>
      </div>
      <AlertMessage type="success" message={message} />
      <AlertMessage type="danger" message={error} />
      {loading ? <LoadingSpinner /> : (
        <div className="row g-3">
          {schedules.length === 0 && (
            <div className="col-12">
              <div className="content-card text-center text-muted">
                No schedules yet. Create one to have pickups generated automatically.
              </div>
            </div>
          )}
          {schedules.map((schedule) => (
            <div className="col-md-6 col-xl-4" key={schedule.id}>
              <div className="content-card h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <h2 className="h5">{schedule.location_name}</h2>
                  <span className={`badge ${schedule.status === "active" ? "bg-success" : "bg-secondary"}`}>
                    {schedule.status}
                  </span>
                </div>
                <p className="text-muted mb-1">{frequencyLabels[schedule.frequency] || schedule.frequency} · {schedule.waste_type}</p>
                <p className="mb-1">Starts: {formatDate(schedule.start_date)}</p>
                <p className="mb-1">Next generation: {formatDate(schedule.next_run_date)}</p>
                <p className="mb-3">Upcoming pickups waiting: {schedule.upcoming_pickups}</p>
                <div className="d-flex gap-2 flex-wrap">
                  {schedule.status === "active" ? (
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => act(() => scheduleService.pause(schedule.id), "Schedule paused.")}>Pause</button>
                  ) : (
                    <button className="btn btn-outline-success btn-sm" onClick={() => act(() => scheduleService.resume(schedule.id), "Schedule resumed.")}>Resume</button>
                  )}
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeSchedule(schedule.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MySchedules;
