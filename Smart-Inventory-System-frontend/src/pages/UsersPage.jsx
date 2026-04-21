import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { getApiErrorMessage } from "../services/apiClient";
import { getAllUsers } from "../services/userService";

function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ kind: "", message: "" });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        if (active) {
          setUsers(response.data || []);
        }
      } catch (err) {
        if (active) {
          setStatus({ kind: "error", message: getApiErrorMessage(err) });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState label="Loading users route..." />;
  }

  return (
    <section>
      <PageHeader title="Users" subtitle="Admin-managed user records from the backend." />
      <StatusBanner kind={status.kind} message={status.message} />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default UsersPage;
