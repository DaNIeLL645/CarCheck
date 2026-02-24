import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

interface StatusEmailProps {
  userName: string;
  carMake: string;
  carModel: string;
  status: "ACCEPTED" | "COMPLETED";
  reportUrl: string; // Link-ul către platformă pentru a vedea detaliile
}

export const StatusEmail = ({
  userName = "Client",
  carMake = "Auto",
  carModel = "Vehicul",
  status = "ACCEPTED",
  reportUrl = "http://localhost:3000/my-inspections",
}: StatusEmailProps) => {
  const isCompleted = status === "COMPLETED";

  return (
    <Html>
      <Head />
      <Preview>
        {isCompleted
          ? `Raportul pentru ${carMake} este gata!`
          : `Un mecanic a preluat ${carMake} a ta!`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Salut, {userName}!</Heading>

          <Section style={section}>
            <Text style={text}>
              Avem vești despre cererea ta pentru verificarea mașinii{" "}
              <strong>
                {carMake} {carModel}
              </strong>
              .
            </Text>

            <Text style={highlightText}>
              {isCompleted
                ? "🎉 Raportul tău de inspecție a fost finalizat! Poți intra acum pe platformă pentru a vedea concluziile mecanicului și pentru a descărca documentul PDF."
                : "👨‍🔧 Un mecanic partener a acceptat cererea ta și a început procesul de verificare. Te vom anunța imediat ce raportul este gata!"}
            </Text>

            <Button href={reportUrl} style={button}>
              {isCompleted ? "Vezi Raportul Complet" : "Urmărește Statusul"}
            </Button>
          </Section>

          <Text style={footer}>
            Echipa CarCheck • Acest email a fost generat automat.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Câteva stiluri inline (necesare pentru email-uri)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Helvetica, sans-serif",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};
const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "0 40px",
};
const section = { padding: "0 40px" };
const text = { fontSize: "16px", color: "#525f7f", lineHeight: "24px" };
const highlightText = {
  fontSize: "16px",
  color: "#1a202c",
  lineHeight: "24px",
  backgroundColor: "#f0f4f8",
  padding: "16px",
  borderRadius: "8px",
};
const button = {
  backgroundColor: "#2563eb",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "14px",
  marginTop: "24px",
};
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  padding: "0 40px",
  marginTop: "32px",
  textAlign: "center" as const,
};

export default StatusEmail;
