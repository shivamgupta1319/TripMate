import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { addMemberToTrip } from "../services/trips";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

interface MemberFormData {
  email: string;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  tripId,
}) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MemberFormData>();

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (data: MemberFormData) => addMemberToTrip(tripId, data.email),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trip", tripId]);
        toast({
          title: "Member added successfully",
          status: "success",
          duration: 3000,
        });
        onClose();
        reset();
      },
      onError: (error: any) => {
        toast({
          title: "Error adding member",
          description: error.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 3000,
        });
      },
    }
  );

  const onSubmit = (data: MemberFormData) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Member Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                  placeholder="Enter member's email"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Add Member
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddMemberModal;
