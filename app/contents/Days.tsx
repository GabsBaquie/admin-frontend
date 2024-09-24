import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import ContentManager from "@/app/contents/genericT/ContentManager";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Program } from "../types/Program";

interface Concert {
  id: number;
  name: string;
}

const DaysManager: React.FC = () => {
  const contentType = "days";
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetchWithAuth<Concert[]>("concerts");
        console.log("Concerts fetched:", response);
        setConcerts(response);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await fetchWithAuth<Program[]>("programs");
        console.log("Programs fetched:", response);
        setPrograms(response);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchConcerts();
    fetchPrograms();
  }, []);

  const columns = [
    { id: "id" as const, label: "ID" },
    { id: "name" as const, label: "Name" },
    { id: "date" as const, label: "Date" },
    { id: "concertId" as const, label: "Concert ID" },
    { id: "programId" as const, label: "Program ID" },
  ];

  const fields = [
    { name: "name" as const, label: "Name", required: true, type: "text" },
    { name: "date" as const, label: "Date", required: true, type: "date" },
    {
      name: "programId" as const,
      label: "Program",
      required: true,
      type: "select",
      options: programs.map((program: Program) => ({
        value: program.id,
        label: program.name,
      })),
    },
    {
      name: "concertId" as const,
      label: "Concert",
      required: true,
      type: "select",
      options: concerts.map((concert: Concert) => ({
        value: concert.id,
        label: concert.name,
      })),
    },
  ];

  return (
    <Container maxWidth="lg">
      <ContentManager
        contentType={contentType}
        columns={columns}
        fields={fields}
      />
    </Container>
  );
};

export default DaysManager;
