import ContentManager from "@/app/contents/genericT/ContentManager";
import { useToast } from "@/app/context/ToastContext";
import {
  ConcertPayload,
  transformConcertToPayload,
} from "@/app/helpers/transformConcertToPayload";
import { Concert } from "@/app/types/Concert";
import { Column, Field } from "@/app/types/content";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Day {
  id: number;
  title: string;
  date: string;
}

const ConcertsManager: React.FC = () => {
  const contentType = "concerts";
  const [days, setDays] = useState<Day[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await fetchWithAuth<Day[]>("days");
        setDays(response);
      } catch {
        showToast("Erreur lors du chargement des jours", "error");
      }
    };
    fetchDays();
  }, [showToast]);

  const columns: Column<Concert>[] = [
    { id: "id", label: "ID" },
    { id: "title", label: "Nom" },
    { id: "description", label: "Description" },
    { id: "performer", label: "Interprète" },
    {
      id: "time",
      label: "Heure",
      render: (row: Concert) => {
        try {
          const [hours, minutes] = row.time.split(":");
          return `${hours}:${minutes}`;
        } catch {
          return row.time;
        }
      },
    },
    { id: "location", label: "Lieu" },
    {
      id: "image",
      label: "Image",
      render: (row: Concert) => (row.image ? "true" : "false"),
    },
    {
      id: "days",
      label: "Jours",
      render: (row: Concert) =>
        Array.isArray(row.days) && row.days.length > 0
          ? row.days.map((day) => day.title).join(" , ")
          : "Aucun jour",
    },
  ];

  const fields: Field<ConcertPayload>[] = [
    { name: "title", label: "Nom", required: true, type: "text" },
    {
      name: "description",
      label: "Description",
      required: true,
      type: "textarea",
    },
    { name: "performer", label: "Interprète", required: true, type: "text" },
    { name: "time", label: "Heure", required: true, type: "time" },
    { name: "location", label: "Lieu", required: true, type: "text" },
    { name: "image", label: "Image", required: false, type: "text" },
    {
      name: "dayIds",
      label: "Jours",
      required: false,
      type: "multiselect",
      multiple: true,
      options: days.map((day) => ({
        value: day.id,
        label: `${day.title} (${new Date(day.date).toLocaleDateString()})`,
      })),
    },
  ];

  return (
    <Container maxWidth="lg">
      <ContentManager<Concert, ConcertPayload>
        contentType={contentType}
        columns={columns}
        fields={fields}
        transformData={transformConcertToPayload}
      />
    </Container>
  );
};

export default ConcertsManager;
