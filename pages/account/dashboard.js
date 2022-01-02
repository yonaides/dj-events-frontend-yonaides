import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { parseCookies } from "@/helpers/index";
import Layout from "@/components/Layout";
import DashboardEvent from "@/components/DashboardEvent";
import { API_URL } from "@/config/index";
import styles from "@/styles/Dashboard.module.css";

export default function DashboardPage({ events, token }) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery(
    "meEvents",
    () => getMeEvents(token),
    {
      initialData: events,
    }
  );

  if (isLoading) {
    return <img src="../../images/bgimage.jpg" alt="background" />;
  }

  if (isError) {
    return <p> the page has error </p>;
  }
  const deleteEvent = async (id) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          toast.error("No token included");
          return;
        }
        toast.error(data.message);
      } else {
        router.reload("/events");
      }
    }
  };

  return (
    <Layout title="User Dashboard">
      <div className={styles.dash}>
        <h1>Dashboard</h1>
        <h3>My Events</h3>

        {data.map((evt) => (
          <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
        ))}
      </div>
    </Layout>
  );
}

async function getMeEvents(token) {
  const res = await fetch(`${API_URL}/events/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);
  const events = await getMeEvents(token);

  return {
    props: {
      events,
      token,
    },
  };
}
