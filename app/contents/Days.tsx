import ContentManager from '@/app/contents/genericT/ContentManager';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
interface Concert {
  id: number;
  title: string;
}

const DaysManager: React.FC = () => {
  const contentType = 'days';
  const [concerts, setConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetchWithAuth<Concert[]>('concerts');
        console.log('Concerts fetched:', response);
        setConcerts(response);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };

    fetchConcerts();
  }, []);

  const columns = [
    { id: 'id' as const, label: 'ID' },
    { id: 'title' as const, label: 'Name' },
    { id: 'date' as const, label: 'Date' },
    { id: 'concerts' as const, label: 'Concerts',
      render: (row: Day) => {
      if (!Array.isArray(row.concerts) || row.concerts.length === 0) {
        return 'Aucun concert';
      }
      return row.concerts.map((concert) => concert.title).join(' , ');
    }, }
  ];

  const fields = [
    { name: 'title' as const, label: 'Name',required:true, type: 'text' },
    { name: 'date' as const, label: 'Date', required: true, type: 'date' },
    {
      name: 'concertIds' as const,
      label: 'Concerts',
      required: true,
      type: 'multiselect',
      multiple: true,
      options: concerts.map((concert: Concert) => ({
        value: concert.id,
        label: concert.title,
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
