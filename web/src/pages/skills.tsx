import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { GetServerSideProps } from "next";
import { validateTokenAndRedirectLogin } from "@/utils/tokenValidity";
import { Box, Button } from "@mui/material";
import { Header } from "@/components/Header";
import { useState } from "react";
import { useSkills } from "@/hooks/useSkills";
import SkillModal from "@/components/SkillModal";
import SkillListing from "@/components/SkillListing";
import { CreateSkillInput } from "@/apiCalls/skills";
import { useUser } from "@/context/UserContext";
import { UserRole } from "@/apiCalls/signup";

export default function Home() {
  const { skills, isLoading, error, updateSkill, deleteSkill } = useSkills();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const userContext = useUser();
  const handleCreate = () => {
    setEditingSkill(null);
    setModalOpen(true);
  };

  const handleEdit = (skill: CreateSkillInput) => {
    setEditingSkill(skill);
    setModalOpen(true);
  };

  const handleSubmit = async (data: CreateSkillInput) => {
    await updateSkill({ ...data, id: editingSkill?.id || null });
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      setModalOpen(false);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <>
      <Header />
      <Head>
        <title>Skill Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading skills</div>
      ) : (
        <div>
          <Box display="flex" p={2}>
            <Button variant="contained" onClick={handleCreate}>
              Create Skill
            </Button>
          </Box>
          <SkillListing skills={skills} onEdit={handleEdit} />
          <SkillModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingSkill}
          />
          <main className={styles.main}></main>
          <footer className={styles.footer}></footer>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenCheck = await validateTokenAndRedirectLogin(context);
  if (tokenCheck.redirect) return tokenCheck;
  //allow only user to acces this page
  if (tokenCheck.user.role !== UserRole.PROVIDER) {
    return {
      redirect: {
        destination: `/?callbackUrl`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: tokenCheck.user,
    },
  };
};
