import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "react-query";
import { registerUser } from "../services/auth";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const mutation = useMutation(registerUser, {
    onSuccess: () => {
      toast({
        title: "Account created.",
        description: "You can now login with your credentials.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to create account. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="full"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <VStack spacing={4}>
          <Heading>Register</Heading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={mutation.isLoading}
              >
                Register
              </Button>
            </VStack>
          </form>
          <Text>
            Already have an account?{" "}
            <Link to="/login">
              <Text as="span" color="blue.500">
                Login
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
