import { useEffect, useState } from "react";
import "./App.css";

type Booking = {
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

  const [form, setForm] = useState<Booking>({
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
      const updatedBookings = bookings.map((booking, index) => {
        if (index === editingIndex) {
          return form;
        }

        return booking;
      });

      setBookings(updatedBookings);
      setEditingIndex(null);
      setSuccessMessage("Booking updated successfully.");
    } else {
      setBookings([...bookings, form]);
      setSuccessMessage("Booking submitted successfully.");
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
    });
  }

  function deleteBooking(indexToDelete: number) {
    setBookings(bookings.filter((_, index) => index !== indexToDelete));
  }

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

      {bookings.length > 0 && (
        <section className="booking-list">
          <h2>Saved Bookings</h2>

          {bookings.map((booking, index) => (
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
                  setEditingIndex(index);
                  setShowBooking(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => deleteBooking(index)}>Delete</button>
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