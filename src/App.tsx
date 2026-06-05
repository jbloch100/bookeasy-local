import { useEffect, useState } from "react";
import "./App.css";

type Booking = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
};

function App() {
  const [showBooking, setShowBooking] = useState(false);


  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem("bookings");

    if (savedBookings) {
      return JSON.parse(savedBookings);
    }

    return [];
  });
  


  const [successMessage, setSuccessMessage] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState<Booking>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingIndex !== null) {
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === editingIndex) {
          return form;
        }

        return booking;
      });

      setBookings(updatedBookings);
      setEditingIndex(null);
      setSuccessMessage("Booking updated successfully.");
    } else {
      const newBooking = {
        ...form,
        id: Date.now(),
      };

      setBookings([...bookings, newBooking]);
      setSuccessMessage("Booking submitted successfully.");
    }

    setForm({
      id: 0,
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
    });
  }

  function deleteBooking(idToDelete: number) {
    setBookings(
      bookings.filter((booking) => booking.id !== idToDelete)
    );
  }

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBookings = bookings.length;

  const haircutBookings = bookings.filter(
    (booking) => booking.service === "Haircut"
  ).length;

  const cleaningBookings = bookings.filter(
    (booking) => booking.service === "Cleaning"
  ).length;

  const tutoringBookings = bookings.filter(
    (booking) => booking.service === "Tutoring"
  ).length;

  return (
    <main className="page">
      <section className="hero">
        <h1>BookEasy Local</h1>
        <p>
          Simple online booking for local businesses like cleaners, tutors,
          barbers, dog walkers, and photographers.
        </p>

        <div className="buttons">
          <button onClick={() => setShowBooking(true)}>Book an Appointment</button>
          <button className="secondary">View Demo</button>
        </div>
      </section>

      {showBooking && (
        <section className="booking-form">
          <h2>Book an Appointment</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
            />

            <select
              name="service"
              value={form.service}
              onChange={handleChange}
            >
              <option value="">Choose a service</option>
              <option value="Haircut">Haircut</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Tutoring">Tutoring</option>
            </select>

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />

            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
            />

            <button type="submit">
              {editingIndex !== null ? "Update Booking" : "Submit Booking"}
            </button>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);

                  setForm({
                    id: 0,
                    name: "",
                    email: "",
                    phone: "",
                    service: "",
                    date: "",
                    time: "",
                  });
                }}
              >
                Cancel Edit
              </button>
            )}

            {successMessage && <p className="success">{successMessage}</p>}
          </form>
        </section>
      )}

      <section className="stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>

        <div className="stat-card">
          <h3>Haircuts</h3>
          <p>{haircutBookings}</p>
        </div>

        <div className="stat-card">
          <h3>Cleaning</h3>
          <p>{cleaningBookings}</p>
        </div>

        <div className="stat-card">
          <h3>Tutoring</h3>
          <p>{tutoringBookings}</p>
        </div>
      </section>

      {bookings.length > 0 && (
        <section className="booking-list">
          <h2>Saved Bookings</h2>

          <input
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredBookings.map((booking, index) => (
            <div className="booking-card" key={index}>
              <h3>{booking.service}</h3>
              <p>{booking.name}</p>
              <p>{booking.email}</p>
              <p>{booking.phone}</p>
              <p>
                {booking.date} at {booking.time}
              </p>

              <button
                onClick={() => {
                  setForm(booking);
                  setEditingIndex(booking.id);
                  setShowBooking(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => deleteBooking(booking.id)}>Delete</button>
            </div>
          ))}
        </section>
      )}

      <section className="features">
        <div>
          <h2>Easy Booking</h2>
          <p>Customers can book appointments online anytime.</p>
        </div>

        <div>
          <h2>Business Dashboard</h2>
          <p>Owners can see bookings and manage services.</p>
        </div>

        <div>
          <h2>Simple Pricing</h2>
          <p>Built for small businesses that want something simple.</p>
        </div>
      </section>
    </main>
  );
}

export default App;