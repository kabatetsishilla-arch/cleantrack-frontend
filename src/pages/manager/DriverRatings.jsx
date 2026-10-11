import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { driverRatingService } from "../../services/driverRatingService";
import { formatDate } from "../../utils/formatDate";

const DriverRatings = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    driverRatingService.summary()
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load driver ratings"));
  }, []);

  if (error) return <AlertMessage type="danger" message={error} />;
  if (!data) return <LoadingSpinner />;

  return (
    <>
      <h1 className="h3 mb-3">Driver Ratings</h1>
      <div className="content-card mb-4">
        <h2 className="h5">Averages per driver</h2>
        {data.summary.length === 0 ? (
          <p className="text-muted mb-0">No drivers found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr><th>Driver</th><th>Average rating</th><th>Total ratings</th></tr>
              </thead>
              <tbody>
                {data.summary.map((driver) => (
                  <tr key={driver.driver_id}>
                    <td>{driver.driver_name}</td>
                    <td>{Number(driver.average_rating) > 0 ? `${driver.average_rating} ★` : "Not rated yet"}</td>
                    <td>{driver.total_ratings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="content-card">
        <h2 className="h5">Recent ratings</h2>
        {data.recent.length === 0 ? (
          <p className="text-muted mb-0">No ratings submitted yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {data.recent.map((item, index) => (
              <li className="list-group-item px-0" key={index}>
                <strong>{item.rating}★ — {item.driver_name}</strong> ({item.location_name}, by {item.customer_name})
                <div className="text-muted small">{item.comment || "No comment"} · {formatDate(item.created_at)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default DriverRatings;
