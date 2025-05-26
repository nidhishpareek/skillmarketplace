import { GetServerSideProps } from "next";
import { validateTokenAndRedirectLogin } from "@/utils/tokenValidity";
import { Box, Button, Container } from "@mui/material";
import { Header } from "@/components/Header";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import TaskListing from "@/components/TaskListing";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import TaskModificationModal from "@/components/TaskModificationModal";
import OfferModal from "@/components/OfferModal";
import { withTaskProvider } from "@/hoc/WithTaskProvider";
import { useUser } from "@/context/UserContext";
import { UserRole } from "@/apiCalls/signup";

function Home() {
  const {
    isLoading,
    error,
    onCreateTask,
    detailsModalOpen,
    modificationModalOpen,
    offerModalOpen,
    setDetailsModalOpen,
    setModificationModalOpen,
    setOfferModalOpen,
    selectedTask,
    onOffer,
  } = useTaskContext();
  const { user } = useUser();

  return (
    <>
      <Header />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading tasks</div>
      ) : (
        <Container sx={{ padding: "2rem" }}>
          <main>
            {user?.role === UserRole.USER && (
              <Box display="flex" justifyContent="flex-start" p={2}>
                <Button
                  variant="contained"
                  onClick={onCreateTask}
                  sx={{ display: "block" }}
                >
                  Create Task
                </Button>
              </Box>
            )}
            <TaskListing />
            <TaskDetailsModal
              open={detailsModalOpen}
              onClose={() => setDetailsModalOpen(false)}
              task={selectedTask}
            />
            <TaskModificationModal key={selectedTask?.id || ""} />
            <OfferModal key={`offer-${selectedTask?.id || ""}`} />
          </main>
        </Container>
      )}
    </>
  );
}

export default withTaskProvider(Home);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenCheck = await validateTokenAndRedirectLogin(context);
  if (tokenCheck.redirect) return tokenCheck;

  return {
    props: {
      user: tokenCheck.user,
    },
  };
};
