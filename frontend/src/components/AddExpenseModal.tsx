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
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { createExpense } from "../services/expenses";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

interface ExpenseFormData {
  description: string;
  amount: number;
  date: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  tripId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ExpenseFormData>();

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (data: ExpenseFormData) =>
      createExpense({
        tripId,
        ...data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trip", tripId]);
        onClose();
        reset();
      },
    }
  );

  const onSubmit = (data: ExpenseFormData) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input {...register("description", { required: true })} />
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon>₹</InputLeftAddon>
                  <Input
                    type="number"
                    {...register("amount", { required: true, min: 0 })}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input type="date" {...register("date", { required: true })} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Add Expense
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddExpenseModal;
