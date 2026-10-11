import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { categoryService } from "../../services/categoryService";
import { locationService } from "../../services/locationService";
import { scheduleService } from "../../services/scheduleService";

const NewSchedule = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    location_id: "",
    waste_category_id: "",
    frequency: "weekly",
    start_date: "",
    urgency: "normal"
  });

  useEffect(() => {
    Promise.all([locationService.myLocations(), categoryService.list()]).then(([locationResponse, categoryResponse]) => {
      setLocations(locationResponse.data);
      setCategories(categoryResponse.data.filter((item) => item.status === "active"));
    });
  }, []);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await scheduleService.create(form);
      navigate("/customer/schedules");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not create schedule");
    }
  };

  return (
    <div className="content-card">
      <h1 className="h3">New Pickup Schedule</h1>
      <p className="text-muted">The next four pickups are generated automatically when you save.</p>
      <AlertMessage type="danger" message={message} />
      {locations.length === 0 && (
        <AlertMessage type="warning" message="Add a location first before creating a schedule." />
      )}
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Location</label>
          <select className="form-select" name="location_id" value={form.location_id} onChange={handleChange} required>
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.is_favourite ? "★ " : ""}{location.location_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Waste type</label>
          <select className="form-select" name="waste_category_id" value={form.waste_category_id} onChange={handleChange} required>
            <option value="">Select waste type</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Frequency</label>
          <select className="form-select" name="frequency" value={form.frequency} onChange={handleChange}>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Start date</label>
          <input className="form-control" type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Urgency</label>
          <select className="form-select" name="urgency" value={form.urgency} onChange={handleChange}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="col-12">
          <button className="btn btn-cleantrack" disabled={locations.length === 0}>Create Schedule</button>
        </div>
      </form>
    </div>
  );
};

export default NewSchedule;
