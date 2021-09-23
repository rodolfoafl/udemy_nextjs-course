import { useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { API_URL } from "@/config/index";

import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImageUpload";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Form.module.css";

import moment from "moment";
import { FaImage } from "react-icons/fa";

const EditEventPage = ({ evt }) => {
  const [values, setValues] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );

  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/events/${evt.id}`);
    const data = await res.json();
    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ""
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all fields!");
    }

    const requestUrl = `${API_URL}/events/${evt.id}`;
    const res = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error(`Error on request: ${requestUrl}`);
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout title="Edit Event">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label htmlFor="performers">Performers:</label>
            <input
              type="text"
              id="performers"
              name="performers"
              value={values.performers}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label htmlFor="venue">Venue:</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={values.venue}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={moment(values.date).format("yyyy-MM-DD")}
              onChange={handleInputChange}
              // required
            />
          </div>
          <div>
            <label htmlFor="time">Time:</label>
            <input
              type="text"
              id="time"
              name="time"
              value={values.time}
              onChange={handleInputChange}
              // required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            name="description"
            id="description"
            type="text"
            value={values.description}
            onChange={handleInputChange}
            // required
          ></textarea>
        </div>

        <input type="submit" value="Update Event" className="btn" />
      </form>

      <div className={styles.imagePreview}>
        <h2>Event Image</h2>
        {imagePreview ? (
          <Image src={imagePreview} height={100} width={170} />
        ) : (
          <p>No image uploaded</p>
        )}

        <div>
          <button className="btn-secondary" onClick={() => setShowModal(true)}>
            <FaImage /> Set Image
          </button>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload eventId={evt.id} imageUploaded={imageUploaded} />
      </Modal>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/events/${id}`);
  const evt = await res.json();

  return {
    props: {
      evt,
    },
  };
}

export default EditEventPage;
