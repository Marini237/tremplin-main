"use client";

import { useState } from "react";

type Availability = {
  id: string;
  dateLabel: string;
  timeRange: string;
};

export default function ContactForm() {
  const [civilite, setCivilite] = useState("Mme");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [messageType, setMessageType] = useState("Demande de visite");
  const [message, setMessage] = useState("");

  const [selectedDay, setSelectedDay] = useState("Lundi");
  const [selectedHour, setSelectedHour] = useState("8h");
  const [selectedMinute, setSelectedMinute] = useState("30m");

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">(
    "",
  );

  function handleAddAvailability() {
    const newAvailability: Availability = {
      id: crypto.randomUUID(),
      dateLabel: selectedDay,
      timeRange: `${selectedHour}${selectedMinute !== "0m" ? selectedMinute : ""}`,
    };

    setAvailabilities((prev) => [...prev, newAvailability]);
  }

  function handleRemoveAvailability(id: string) {
    setAvailabilities((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSubmit() {
    setFeedbackMessage("");
    setFeedbackType("");

    if (!nom || !prenom || !email || !message) {
      setFeedbackMessage("Merci de remplir les champs obligatoires.");
      setFeedbackType("error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/Contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          civilite,
          nom,
          prenom,
          email,
          telephone,
          messageType,
          message,
          availabilities: availabilities.map(({ dateLabel, timeRange }) => ({
            dateLabel,
            timeRange,
          })),
        }),
      });

      const contentType = response.headers.get("content-type");

      let data: { error?: string; message?: string } | null = null;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "La réponse du serveur n'est pas du JSON.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Erreur lors de l'envoi.");
      }
      setFeedbackMessage("Votre demande a bien été envoyée.");
      setFeedbackType("success");

      setCivilite("Mme");
      setNom("");
      setPrenom("");
      setEmail("");
      setTelephone("");
      setMessageType("Demande de visite");
      setMessage("");
      setSelectedDay("Lundi");
      setSelectedHour("8h");
      setSelectedMinute("30m");
      setAvailabilities([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue.";

      setFeedbackMessage(message);
      setFeedbackType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-grid">
      <div className="left-column">
        <h2 className="section-title">VOS COORDONNÉES</h2>

        <div className="radio-row">
          <label className="radio-option">
            <input
              type="radio"
              name="civilite"
              checked={civilite === "Mme"}
              onChange={() => setCivilite("Mme")}
            />
            <span>Mme</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="civilite"
              checked={civilite === "M"}
              onChange={() => setCivilite("M")}
            />
            <span>M</span>
          </label>
        </div>

        <div className="contact-fields">
          <div className="name-row">
            <input
              className="form-input half-input"
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <input
              className="form-input half-input"
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>

          <input
            className="form-input full-input"
            type="email"
            placeholder="Adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-input full-input"
            type="tel"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        <div className="availability-section">
          <h3 className="availability-title">DISPONIBILITÉS POUR UNE VISITE</h3>

          <div className="availability-controls">
            <select
              className="availability-select day-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option>Lundi</option>
              <option>Mardi</option>
              <option>Mercredi</option>
              <option>Jeudi</option>
              <option>Vendredi</option>
              <option>Samedi</option>
            </select>

            <select
              className="availability-select small-select"
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
            >
              <option>7h</option>
              <option>8h</option>
              <option>9h</option>
              <option>10h</option>
              <option>11h</option>
              <option>14h</option>
              <option>15h</option>
              <option>16h</option>
              <option>17h</option>
            </select>

            <select
              className="availability-select small-select"
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
            >
              <option>0m</option>
              <option>15m</option>
              <option>30m</option>
              <option>45m</option>
            </select>

            <button
              type="button"
              className="add-button"
              onClick={handleAddAvailability}
            >
              AJOUTER DISPO
            </button>
          </div>

          <div className="availability-tags">
            {availabilities.length > 0 ? (
              availabilities.map((availability) => (
                <div className="availability-tag" key={availability.id}>
                  <span>
                    {availability.dateLabel} à {availability.timeRange}
                  </span>
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveAvailability(availability.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-availability">
                Aucune disponibilité ajoutée pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="right-column">
        <h2 className="section-title">VOTRE MESSAGE</h2>

        <div className="radio-row radio-row--message">
          <label className="radio-option">
            <input
              type="radio"
              name="messageType"
              checked={messageType === "Demande de visite"}
              onChange={() => setMessageType("Demande de visite")}
            />
            <span>Demande de visite</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="messageType"
              checked={messageType === "Être rappelé.e"}
              onChange={() => setMessageType("Être rappelé.e")}
            />
            <span>Être rappelé.e</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="messageType"
              checked={messageType === "Plus de photos"}
              onChange={() => setMessageType("Plus de photos")}
            />
            <span>Plus de photos</span>
          </label>
        </div>

        <div className="message-box">
          <textarea
            className="message-textarea"
            placeholder="Votre message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {feedbackMessage && (
          <p
            className={`feedback-message ${feedbackType === "success" ? "feedback-success" : "feedback-error"}`}
          >
            {feedbackMessage}
          </p>
        )}

        <div className="submit-row">
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "ENVOI..." : "ENVOYER"}
          </button>
        </div>
      </div>
    </div>
  );
}
