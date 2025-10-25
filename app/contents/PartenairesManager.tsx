import {
  DateRenderer,
  ImageRenderer,
  StatusRenderer,
} from "@/app/components/renderers";
import { BaseContentManager } from "@/app/contents/common";
import { PartenairePayload } from "@/app/helpers/transformPartenaireToPayload";
import { Partenaire } from "@/app/types/Partenaire";
import { Column, Field } from "@/app/types/content";
import React from "react";

const PartenairesManager: React.FC = () => {
  const contentType = "partenaires";

  const columns: Column<Partenaire>[] = [
    { id: "id", label: "ID" },
    { id: "name", label: "Nom" },
    { id: "type", label: "Type" },
    { id: "link", label: "Lien" },
    {
      id: "image",
      label: "Logo",
      render: (row: Partenaire) => (
        <ImageRenderer
          src={row.image || ""}
          alt="Logo du partenaire"
          width={60}
          height={60}
        />
      ),
    },
    {
      id: "actif",
      label: "Actif",
      render: (row: Partenaire) => <StatusRenderer value={row.actif} />,
    },
    {
      id: "created_at",
      label: "Créé le",
      render: (row: Partenaire) => <DateRenderer value={row.created_at} />,
    },
  ];

  const fields: Field<PartenairePayload>[] = [
    { name: "name", label: "Nom", required: true, type: "text" },
    {
      name: "type",
      label: "Type",
      required: true,
      type: "select",
      options: [
        { value: "Institution", label: "Institution" },
        { value: "Media", label: "Media" },
        { value: "Tech", label: "Tech" },
        { value: "Autre", label: "Autre" },
      ],
    },
    { name: "link", label: "Lien", required: true, type: "text" },
    {
      name: "logo_alt",
      label: "Texte alternatif du logo",
      required: true,
      type: "text",
    },
    {
      name: "actif",
      label: "Actif",
      required: true,
      type: "select",
      options: [
        { value: "true", label: "Oui" },
        { value: "false", label: "Non" },
      ],
    },
    { name: "image", label: "Logo", required: false, type: "image" },
  ];

  return (
    <BaseContentManager<Partenaire, PartenairePayload>
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default PartenairesManager;
