import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Button,
  useDisclosure,
  VStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Badge,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useQuery } from "react-query";
import { fetchTrips } from "../services/trips";
import CreateTripModal from "../components/CreateTripModal";
import { Trip } from "../types";
import { useNavigate } from "react-router-dom";
import { formatINR } from "../utils/currency";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: trips, isLoading } = useQuery<Trip[]>("trips", fetchTrips);
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");

  const calculateTotalExpenses = (trip: Trip) => {
    if (!trip.expenses) return 0;
    return trip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const activeTrips = trips?.filter((trip) => trip.status === "active") || [];
  const completedTrips =
    trips?.filter((trip) => trip.status === "completed") || [];

  const renderTripCard = (trip: Trip) => (
    <Card
      key={trip.id}
      bg={cardBg}
      shadow="md"
      cursor="pointer"
      onClick={() => navigate(`/trip/${trip.id}`)}
      transition="all 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    >
      <CardHeader pb={2}>
        <VStack align="start" spacing={1}>
          <Heading size="md">{trip.name}</Heading>
          <Text color="gray.500" fontSize="sm">
            {trip.destination}
          </Text>
        </VStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="100%">
            <Text fontSize="sm" color="gray.500">
              Total Expenses
            </Text>
            <Text fontWeight="bold">
              {formatINR(calculateTotalExpenses(trip))}
            </Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontSize="sm" color="gray.500">
              Members
            </Text>
            <Badge colorScheme="green">{trip.members.length} members</Badge>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontSize="sm" color="gray.500">
              Date
            </Text>
            <Text fontSize="sm">
              {new Date(trip.startDate).toLocaleDateString()} -{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </Text>
          </HStack>
          <Badge colorScheme={trip.status === "active" ? "green" : "gray"}>
            {trip.status === "active" ? "Active" : "Completed"}
          </Badge>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      <Container maxW="container.xl" pt="20" pb="8">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" py={4}>
            <Heading size="lg">Trips</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={onOpen}
              size="md"
            >
              Create New Trip
            </Button>
          </HStack>

          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Active ({activeTrips.length})</Tab>
                <Tab>Completed ({completedTrips.length})</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {activeTrips.map(renderTripCard)}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {completedTrips.map(renderTripCard)}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </VStack>

        <CreateTripModal isOpen={isOpen} onClose={onClose} />
      </Container>
    </Box>
  );
};

export default Dashboard;
