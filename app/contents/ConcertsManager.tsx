'use client';

import ContentManager from '@/app/contents/genericT/ContentManager';
import { Concert,} from '@/app/types/Concert';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { useToast } from '@/app/context/ToastContext';
import { Column, Field } from '@/app/types/content';

interface Day {
  id: number;
  title: string;
  date: string;
}

interface ConcertFormData {
  id?: number;
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image: string;
  days: number[];
  createdAt?: string;
  updatedAt?: string;
}

const ConcertsManager: React.FC = () => {
  const contentType = 'concerts';
  const [days, setDays] = useState<Day[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await fetchWithAuth<Day[]>('days');
        setDays(response);
      } catch (error) {
        console.error('Error fetching days:', error);
        showToast('Erreur lors du chargement des jours', 'error');
      }
    };

    fetchDays();
  }, [showToast]);

  const columns: Column<Concert>[] = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Nom' },
    { id: 'description', label: 'Description' },
    { id: 'performer', label: 'Interprète' },
    { 
      id: 'time', 
      label: 'Heure',
      render: (row: Concert) => {
        try {
          const [hours, minutes] = row.time.split(':');
          return `${hours}:${minutes}`;
        } catch (error) {
          console.error('Error parsing time:', error);
          return row.time;
        }
      }
    },
    { id: 'location', label: 'Lieu' },
    { id: 'image', label: 'Image' },
    { 
      id: 'days', 
      label: 'Jours',
      render: (row: Concert) => {
        if (!Array.isArray(row.days) || row.days.length === 0) {
          return 'Aucun jour';
        }
        return row.days.map(day => day.title).join(' , ');
      }
    }
  ];

  const fields: Field<ConcertFormData>[] = [
    { name: 'title', label: 'Nom', required: true, type: 'text' },
    {
      name: 'description',
      label: 'Description',
      required: true,
      type: 'textarea',
    },
    { name: 'performer', label: 'Interprète', required: true, type: 'text' },
    {
      name: 'time',
      label: 'Heure',
      required: true,
      type: 'time',
    },
    { name: 'location', label: 'Lieu', required: true, type: 'text' },
    { name: 'image', label: 'Image', required: false, type: 'image' },
    {
      name: 'days',
      label: 'Jours',
      required: false,
      type: 'multiselect',
      multiple: true,
      options: days.map(day => ({
        value: day.id,
        label: `${day.title} (${new Date(day.date).toLocaleDateString()})`,
      })),
    },
  ];

  const transformData = (data: Concert): ConcertFormData => {
    try {
      console.log('Données avant transformation:', data);
      
      // Vérifier si l'image est en base64
      const isBase64Image = (str: string) => {
        if (!str) return false;
        return str.startsWith('data:image/') && str.includes(';base64,');
      };

      // Transformer les données
      const transformed: ConcertFormData = {
        id: data.id,
        title: data.title,
        description: data.description,
        performer: data.performer,
        time: data.time ? new Date(`1970-01-01T${data.time}`).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }) : '',
        location: data.location,
        image: data.image && isBase64Image(data.image) ? data.image : '',
        days: data.days?.map(day => day.id) || [],
        createdAt: data.createdAt,
        updatedAt: new Date().toISOString()
      };

      console.log('Données après transformation:', transformed);
      return transformed;
    } catch (error) {
      console.error('Erreur lors de la transformation des données:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="lg">
      <ContentManager<Concert, ConcertFormData>
        contentType={contentType}
        columns={columns}
        fields={fields}
        transformData={transformData}
      />
    </Container>
  );
};

export default ConcertsManager;