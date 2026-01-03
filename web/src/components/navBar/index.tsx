import {
  Avatar,
  Box,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";

const NavBar = () => {

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      right={0}
      left={{ base: 0, md: "260px" }}
      h="70px"
      bg="navbar.bg"
      borderBottomWidth="1px"
      borderColor="navbar.border"
      zIndex={99}
      transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Flex h="full" px={6} align="center" justify="flex-end">
        <HStack gap={2}>
              <HStack
                gap={3}
                p={1.5}
                pr={3}
                rounded="full"
                borderWidth="1px"
                borderColor="navbar.border"
                bg={{ _light: "gray.50", _dark: "gray.800" }}
                _hover={{ bg: { _light: "gray.100", _dark: "gray.700" } }}
                transition="background 0.2s"
              >
               <Avatar.Root colorPalette="teal">
                    <Avatar.Fallback name="Sasuke Uchiha" />
                </Avatar.Root>
                <Box display={{ base: "none", lg: "block" }}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    lineHeight="short"
                    color={{ _light: "gray.800", _dark: "white" }}
                  >
                    Sasuke Uchiha
                  </Text>
                  <Text fontSize="xs" color="gray.500" lineHeight="short">
                    Admin
                  </Text>
                </Box>
              </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavBar;
