import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { DatasourceType } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";

import UsageLimitModal from "../UsageLimitModal";

type Props = {
  onSelect: (type: DatasourceType) => any;
};

type DatsourceOption = {
  type: DatasourceType;
  label: string;
  description: string;
  icon?: any;
  disabled?: boolean;
  isPremium?: boolean | undefined;
};

const options: DatsourceOption[] = [
  {
    type: DatasourceType.text,
    label: "Texte",
    description: "Coller du texte",
    icon: undefined,
  },
  {
    type: DatasourceType.web_page,
    label: "Page Web",
    description: `Extraire du texte d'une page web`,
    icon: undefined,
  },
  {
    type: DatasourceType.web_site,
    label: "Site Web",
    description: `Parcourir toutes les pages dun site web`,
    icon: undefined,
    isPremium: true,
  },
  {
    type: "file" as any,
    label: "Fichier",
    description: "Supporte : PDF, CSV, JSON, Texte, PowerPoint, Word, Excel",
    disabled: false,
  },
  {
    type: "google_drive_folder" as any,
    label: "Google Drive",
    description: "Parlez à vos fichiers Google Drive",
    isPremium: true,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/1024px-Google_Drive_icon_%282020%29.svg.png?20221103153031",
    // disabled: true,
  },
  {
    type: "notion" as any,
    label: "Notion",
    description: "Télécharger un carnet de Notion",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg",
    disabled: true,
  },
];

const DatasourceOptions = (props: Props) => {
  const { data: session, status } = useSession();
  const [showUsageLimitModal, setShowUsageLimitModal] = React.useState(false);
  return (
    <div className="flex space-x-4">
      <Stack className="space-y-4" direction={"row"} flexWrap={"wrap"}>
        {options.map((each) => (
          <Sheet
            key={each.type}
            variant="outlined"
            sx={{
              borderRadius: "md",
              p: 1.5,
              width: "100%",
              ":hover": { cursor: "pointer" },
            }}
            onClick={
              each.disabled || (each.isPremium && !session?.user?.isPremium)
                ? () => setShowUsageLimitModal(true)
                : () => props.onSelect(each.type)
            }
          >
            <Stack gap={1}>
              <Stack gap={1} direction="row">
                {each.icon && <img src={each.icon} className="h-4" alt="" />}
                <Typography level="body1" fontWeight={"bold"}>
                  {each.label}
                </Typography>
                {each.isPremium && (
                  <Chip variant="soft" color="warning" size="sm">
                    premium
                  </Chip>
                )}
                {each.disabled && (
                  <Chip variant="soft" color="neutral" size="sm">
                    Bientôt disponible
                  </Chip>
                )}
              </Stack>
              <Typography level="body2">{each.description}</Typography>
            </Stack>
          </Sheet>
        ))}
      </Stack>

      <UsageLimitModal
        isOpen={showUsageLimitModal}
        handleClose={() => setShowUsageLimitModal(false)}
        title="Fonctionnalité Premium"
        description="Mettez votre compte à niveau pour accéder à cette fonctionnalité"
      />
    </div>
  );
};

export default DatasourceOptions;
