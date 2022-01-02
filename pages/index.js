import { useQuery } from "react-query";
import Link from "next/link";
import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL } from "@/config/index";

export default function HomePage() {
  const { data, isLoading, isError } = useQuery("myEvents", async () => {
    return await fetch(`${API_URL}/events?_sort=date:ASC&_limit=3`).then(
      (res) => res.json()
    );
  });

  if (isLoading) {
    return <img src="../images/bgimage.jpg" alt="background" />;
  }

  if (isError) {
    return <div>Something go wrong</div>;
  }

  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {data.length === 0 && <h3>No events to show</h3>}

      {data.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      {data.length > 0 && (
        <Link href="/events">
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  );
}

/*export async function getStaticProps() {
  const res = await fetch(`${API_URL}/events?_sort=date:ASC&_limit=3`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}*/
