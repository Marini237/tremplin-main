import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="page">
      <section className="contact-card">
        <h1 className="title">CONTACTEZ L&apos;AGENCE</h1>
        <ContactForm />
      </section>
    </main>
  );
}