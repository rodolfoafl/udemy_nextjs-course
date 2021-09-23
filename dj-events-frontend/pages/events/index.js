import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL, PER_PAGE } from "@/config/index";
import Pagination from "@/components/Pagination";

const EventsPage = ({ events, page, total }) => {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((e) => (
        <EventItem key={e.id} event={e} />
      ))}

      <Pagination page={page} total={total} />
    </Layout>
  );
};

export async function getServerSideProps({ query: { page = 1 } }) {
  const startPage = Number(page) === 1 ? 0 : (Number(page) - 1) * PER_PAGE;

  const totalRes = await fetch(`${API_URL}/events/count`);
  const total = await totalRes.json();

  const eventRes = await fetch(
    `${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${startPage}`
  );
  const events = await eventRes.json();

  return {
    props: { events, page: Number(page), total },
  };
}

export default EventsPage;
