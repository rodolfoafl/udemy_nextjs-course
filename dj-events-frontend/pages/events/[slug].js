import { FaPencilAlt, FaTimes, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import styles from "@/styles/Event.module.css";
import { API_URL } from "@/config/index";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const EventPage = ({ event }) => {
  const router = useRouter();

  const deleteEvent = async () => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/events");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${event.id}`}>
            <a>
              <FaPencilAlt />
              Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
            Delete Event
          </a>
        </div>

        <span>
          {new Date(event.date).toLocaleDateString("pt-BR")} at {event.time}
        </span>
        <h1>{event.name}</h1>
        <ToastContainer />
        {event.image && (
          <div className={styles.image}>
            <Image
              src={event.image.formats.medium.url}
              width={960}
              height={600}
            />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{event.performers}</p>
        <h3>Description:</h3>
        <p>{event.description}</p>
        <h3>Venue: {event.venue}</h3>
        <p>{event.address}</p>

        <Link href="/events">
          <a className={styles.back}>
            <FaChevronLeft /> Go Back
          </a>
        </Link>
      </div>
    </Layout>
  );
};

export async function getStaticPath() {
  const res = await fetch(`${API_URL}/events`);
  const events = await res.json();
  const paths = events.map((e) => ({
    params: { slug: e.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getServerSideProps({ params: { slug } }) {
  console.log(slug);
  const res = await fetch(`${API_URL}/events?slug=${slug}`);
  const events = await res.json();

  return {
    props: {
      event: events[0],
      revalidate: 1,
    },
  };
}

export default EventPage;
