import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      login(response.access_token, {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Login failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      py={12}
      px={4}
    >
      <Container
        maxW="lg"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="lg"
        rounded="lg"
        p={8}
      >
        <Stack spacing={8}>
          <Stack align="center">
            <Heading fontSize="4xl">Welcome Back</Heading>
            <Text fontSize="lg" color="gray.600">
              to continue to TripManager ✌️
            </Text>
          </Stack>
          <Box rounded="lg" bg={useColorModeValue("white", "gray.700")} p={8}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    bg="blue.400"
                    color="white"
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Text align="center">
            Don't have an account?{" "}
            <Link as={RouterLink} to="/register" color="blue.400">
              Register
            </Link>
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
