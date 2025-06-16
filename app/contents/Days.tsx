import ContentManager from '@/app/contents/genericT/ContentManager';
import { Day } from '@/app/types/Day';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { useToast } from '@/app/context/ToastContext';
import { Column, Field } from '@/app/types/content';

interface Concert {
  id: number;
  title: string;
  time: string;
}

interface DayFormData {
  id?: number;
  title: string;
  date: string;
  concertIds: number[];
}

const DaysManager: React.FC = () => {
  const contentType = 'days';
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetchWithAuth<Concert[]>('concerts');
        setConcerts(response);
      } catch (error) {
        console.error('Error fetching concerts:', error);
        showToast('Erreur lors du chargement des concerts', 'error');
      }
    };

    fetchConcerts();
  }, [showToast]);

  const columns: Column<Day>[] = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Nom' },
    { id: 'date', label: 'Date', render: (row: Day) => new Date(row.date).toLocaleDateString() },
    { id: 'concerts', label: 'Concerts', render: (row: Day) => Array.isArray(row.concerts) && row.concerts.length > 0 ? row.concerts.map(concert => concert.title).join(' , ') : 'Aucun concert' }
  ];

  const fields: Field<DayFormData>[] = [
    { name: 'title', label: 'Nom', required: true, type: 'text' },
    { name: 'date', label: 'Date', required: true, type: 'date' },
    { name: 'concertIds', label: 'Concerts', required: false, type: 'multiselect', multiple: true, options: concerts.map(concert => ({ value: concert.id, label: `${concert.title} (${concert.time})` })) }
  ];

  const transformData = (data: Day): DayFormData => {
    try {
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        concertIds: data.concerts?.map(concert => concert.id) || []
      };
    } catch (error) {
      console.error('Error transforming data:', error);
      showToast('Erreur lors de la transformation des données', 'error');
      throw error;
    }
  };

  return (
    <Container maxWidth="lg">
      <ContentManager<Day, DayFormData>
        contentType={contentType}
        columns={columns}
        fields={fields}
        transformData={transformData}
      />
    </Container>
  );
};

export default DaysManager;