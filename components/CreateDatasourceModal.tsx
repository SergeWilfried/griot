import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import {
  AppDatasource as Datasource,
  DatasourceType,
  DatastoreType,
} from "@prisma/client";
import axios from "axios";
import dynamic from "next/dynamic";
import React from "react";

import useStateReducer from "@app/hooks/useStateReducer";

import DatasourceOptions from "./DatasourceForms/DatasourceOptions";

const DatasourceForm = dynamic(
  () => import("@app/components/DatasourceForms"),
  {
    ssr: false,
  }
);

type Props = {
  datastoreId?: string;
  isOpen?: boolean;
  onSubmitSuccess?: (datasource: Partial<Datasource>) => void;
  handleClose: () => void;
  // onSubmit: (values: CreateDatastoreRequestSchema) => void;
};

type State = {
  selectedStoreType?: DatastoreType;
  selectedSourceType?: DatasourceType;
  activeStep: number;
};

const initialState: State = {
  selectedStoreType: undefined,
  selectedSourceType: undefined,
  activeStep: 0,
};

export default function CreateDatastoreModal(props: Props) {
  const [state, setState] = useStateReducer<State>(initialState);

  const handleNext = () => {
    setState({
      activeStep: state.activeStep + 1,
    });
  };

  const handleBack = () => {
    setState({
      activeStep: state.activeStep - 1,
    });
  };

  const handleReset = () => {
    setState({
      activeStep: 0,
    });
  };

  const steps = [
    {
      label: "Choisir un Document",
      description: `Un document vide n'est pas très utile ! Ajoutons maintenant des données`,
      disableButtons: true,
      component: (
        <DatasourceOptions
          onSelect={async (value) => {
            setState({
              selectedSourceType: value,
            });
            handleNext();
          }}
        />
      ),
    },
    {
      label: "Configuration de la source de données",
      // description: `An empty Datastore is not very useful! Now add some data in it`,
      disableButtons: true,
      component: state?.selectedSourceType && (
        <DatasourceForm
          type={state?.selectedSourceType}
          defaultValues={{
            datastoreId: props.datastoreId,
          }}
          onSubmitSuccess={(values: any) => {
            handleNext();

            props.handleClose();

            handleReset();

            props?.onSubmitSuccess?.(values);
          }}
          customSubmitButton={(btnProps: any) => (
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  type="submit"
                  loading={btnProps.isLoading}
                  variant="solid"
                  sx={{ mt: 1, mr: 1 }}
                >
                  Terminer
                </Button>
                <Button
                  disabled={btnProps.isLoading}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  variant="plain"
                >
                  Retour
                </Button>
              </div>
            </Box>
          )}
        />
      ),
    },
  ];

  return (
    <Modal
      onClose={props.handleClose}
      open={props.isOpen!}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: '100vh',
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 600,
          maxWidth: "100%",
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: "md",
          boxShadow: "lg",
          p: 3,
        }}
      >
        {/* <Alert severity="info">
          Datastores are used to store vectors reprentations of your data
          (embeddings).{' '}
          <Link href="" className="hover:underline" target="_blank">
            Learn more.
          </Link>
        </Alert> */}

        <>
          <Stepper activeStep={state.activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === 3 ? <Typography>Last step</Typography> : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <div className="flex flex-col space-y-4">
                    <Typography>{step.description}</Typography>

                    <Alert color="primary">
                      Griot fonctionne mieux avec des données non structurées. Un meilleur support
                      pour les données tabulaires (csv, excel, etc...) sera bientôt disponible.
                      😉
                    </Alert>

                    {step.component}
                    {!step.disableButtons && (
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="soft"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1
                              ? "Terminer"
                              : "Continuer"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Retour
                          </Button>
                        </div>
                      </Box>
                    )}
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </>
      </Sheet>
    </Modal>
  );
}
