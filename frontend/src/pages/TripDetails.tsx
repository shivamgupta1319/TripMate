import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  IconButton,
  useToast,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchTripDetails,
  removeMemberFromTrip,
  updateTripStatus,
} from "../services/trips";
import AddExpenseModal from "../components/AddExpenseModal";
import { Trip, Expense, User } from "../types";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import AddMemberModal from "../components/AddMemberModal";
import Navbar from "../components/Navbar";
import { formatINR } from "../utils/currency";
import { useAuth } from "../hooks/useAuth";

interface MemberBalance {
  member: User;
  paid: number;
  shouldPay: number;
  balance: number;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const {
    isOpen: isExpenseModalOpen,
    onOpen: onExpenseModalOpen,
    onClose: onExpenseModalClose,
  } = useDisclosure();
  const {
    isOpen: isMemberModalOpen,
    onOpen: onMemberModalOpen,
    onClose: onMemberModalClose,
  } = useDisclosure();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: trip, isLoading } = useQuery<Trip>(["trip", id], () =>
    fetchTripDetails(id!)
  );

  const backgroundColor = useColorModeValue("gray.50", "gray.800");

  const queryClient = useQueryClient();

  const { mutate: removeMember } = useMutation(
    (memberId: string) => removeMemberFromTrip(id!, memberId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trip", id]);
        toast({
          title: "Member removed successfully",
          status: "success",
          duration: 3000,
        });
      },
    }
  );

  const calculateBalances = (trip: Trip): MemberBalance[] => {
    const totalExpenses = trip.expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    const perPersonShare = totalExpenses / trip.members.length;

    return trip.members.map((member) => {
      // Calculate how much this member has paid
      const paidAmount = trip.expenses
        .filter((expense) => expense.user.id === member.id)
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      // Calculate how much this member should pay
      const shouldPay = perPersonShare;

      return {
        member,
        paid: paidAmount,
        shouldPay: shouldPay,
        balance: paidAmount - shouldPay,
      };
    });
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg={backgroundColor}>
        <Navbar />
        <Container maxW="container.xl" pt="20">
          <Text>Loading...</Text>
        </Container>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box minH="100vh" bg={backgroundColor}>
        <Navbar />
        <Container maxW="container.xl" pt="20">
          <Text>Trip not found</Text>
        </Container>
      </Box>
    );
  }

  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  const memberCount = trip.members.length;
  const perPersonShare = memberCount > 0 ? totalExpenses / memberCount : 0;
  const balances = calculateBalances(trip);

  return (
    <Box minH="100vh" bg={backgroundColor}>
      <Navbar />
      <Container maxW="container.xl" pt="20" pb="8">
        <VStack spacing={8} align="stretch">
          <Card bg={cardBg} shadow="md" p={6}>
            <VStack align="start" spacing={2}>
              <Heading size="lg">{trip.name}</Heading>
              <Text color="gray.500" fontSize="lg">
                {trip.destination}
              </Text>
              <HStack spacing={4} color="gray.500">
                <Text>
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </Text>
              </HStack>
            </VStack>
          </Card>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card bg={cardBg} shadow="md">
              <CardHeader>
                <StatGroup>
                  <Stat>
                    <StatLabel fontSize="lg">Total Expenses</StatLabel>
                    <StatNumber color="blue.500">
                      {formatINR(totalExpenses)}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="lg">Per Person</StatLabel>
                    <StatNumber color="green.500">
                      {formatINR(perPersonShare)}
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </CardHeader>
            </Card>

            <Card bg={cardBg} shadow="md">
              <CardHeader>
                <StatGroup>
                  <Stat>
                    <StatLabel fontSize="lg">Total Members</StatLabel>
                    <StatNumber color="purple.500">{memberCount}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="lg">Total Expenses</StatLabel>
                    <StatNumber color="orange.500">
                      {trip.expenses.length}
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </CardHeader>
            </Card>
          </SimpleGrid>

          <Card bg={cardBg} shadow="md">
            <CardHeader>
              <Heading size="md">Settlement Summary</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Member</Th>
                    <Th isNumeric>Paid</Th>
                    <Th isNumeric>Should Pay</Th>
                    <Th isNumeric>Balance</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {balances.map(({ member, paid, shouldPay, balance }) => (
                    <Tr key={member.id}>
                      <Td>{member.name}</Td>
                      <Td isNumeric>{formatINR(paid)}</Td>
                      <Td isNumeric>{formatINR(shouldPay)}</Td>
                      <Td
                        isNumeric
                        color={balance >= 0 ? "green.500" : "red.500"}
                      >
                        {formatINR(Math.abs(balance))}{" "}
                        {balance >= 0 ? "to receive" : "to pay"}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md">
            <CardHeader>
              <HStack justify="space-between" mb={4}>
                <Heading size="md">Members</Heading>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="green"
                  onClick={onMemberModalOpen}
                  disabled={trip.status === "completed"}
                >
                  Add Member
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {trip.members?.map((member) => (
                  <Box
                    key={member.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor={borderColor}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{member.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {member.email}
                        </Text>
                      </VStack>
                      <IconButton
                        aria-label="Remove member"
                        icon={<DeleteIcon />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeMember(member.id)}
                      />
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md">
            <CardHeader>
              <HStack justify="space-between" mb={4}>
                <Heading size="md">Expenses</Heading>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={onExpenseModalOpen}
                  disabled={trip.status === "completed"}
                >
                  Add Expense
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {trip.expenses?.map((expense: Expense) => (
                  <Box
                    key={expense.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor={borderColor}
                  >
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold">{expense.description}</Text>
                      <Text color="blue.500" fontSize="lg" fontWeight="bold">
                        {formatINR(expense.amount)}
                      </Text>
                      <Divider />
                      <Text fontSize="sm" color="gray.500">
                        Paid by {expense.user.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(expense.date).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {trip.creator.id === currentUser?.id && trip.status === "active" && (
            <Button
              colorScheme="orange"
              onClick={() =>
                updateTripStatus(trip.id, "completed").then(() => {
                  queryClient.invalidateQueries(["trip", id]);
                  toast({
                    title: "Trip marked as completed",
                    status: "success",
                    duration: 3000,
                  });
                })
              }
            >
              Mark as Completed
            </Button>
          )}
        </VStack>

        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={onExpenseModalClose}
          tripId={id!}
        />
        <AddMemberModal
          isOpen={isMemberModalOpen}
          onClose={onMemberModalClose}
          tripId={id!}
        />
      </Container>
    </Box>
  );
};

export default TripDetails;
