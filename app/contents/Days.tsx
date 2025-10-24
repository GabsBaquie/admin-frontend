"use client";

import ContentManager from "@/app/contents/genericT/ContentManager";
import { useToast } from "@/app/context/ToastContext";
import { DayCreateOrUpdatePayload } from "@/app/helpers/transformDayToPayload";
import { Column, Field } from "@/app/types/content";
import { Day } from "@/app/types/Day";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Concert {
  id: number;
  title: string;
  time: string;
}

interface DayFormData {
  id?: number;
  title: string;
  date: string;
  image?: string;
  concertIds: number[];
}

const DaysManager: React.FC = () => {
  const contentType = "days";
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetchWithAuth<Concert[]>("concerts");
        setConcerts(response);
      } catch (error) {
        console.error("Error fetching concerts:", error);
        showToast("Erreur lors du chargement des concerts", "error");
      }
    };

    fetchConcerts();
  }, [showToast]);

  const columns: Column<Day>[] = [
    { id: "id", label: "ID" },
    { id: "title", label: "Nom" },
    { id: "date", label: "Date" },
    { id: "image", label: "Image" },
    { id: "concerts", label: "Concerts" },
  ];

  const fields: Field<DayFormData>[] = [
    { name: "title", label: "Nom", required: true, type: "text" },
    { name: "date", label: "Date", required: true, type: "date" },
    { name: "image", label: "Image", required: false, type: "image" },
    {
      name: "concertIds",
      label: "Concerts",
      required: false,
      type: "multiselect",
      multiple: true,
      options: concerts.map((concert) => ({
        value: concert.id,
        label: `${concert.title} (${concert.time})`,
      })),
    },
  ];

  const transformData = (data: Day): DayCreateOrUpdatePayload => {
    const payload = {
      title: data.title,
      date: data.date,
      image: data.image,
      concertIds:
        data.concerts?.map((concert) => concert.id) ?? data.concertIds ?? [],
    };
    console.log("Payload transformData:", payload);
    return payload;
  };

  return (
    <Container maxWidth="lg">
      <ContentManager<Day, DayCreateOrUpdatePayload>
        contentType={contentType}
        columns={columns}
        fields={fields}
        transformData={transformData}
      />
    </Container>
  );
};

export default DaysManager;
