import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import {
  LayoutDashboard,
  BarChart3,
  Database,
  Boxes,
  Zap,
  Globe,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Revenue Table​",
    href: "/revenue-table",
    icon: BarChart3,
  },
  {
    name: "Frequently Purchased Products",
    href: "/frequently-purchased-products",
    icon: Database,
  },
  {
    name: "Sales Volume",
    href: "/sales-volume",
    icon: Boxes,
  },
  {
    name: "Revenue​ Regions",
    href: "/revenue-regions",
    icon: Globe,
  },
];

interface SidebarItemProps {
  item: NavItem;
}

const SidebarItem = ({ item }: SidebarItemProps) => {
  return (
    <Box w="full">
      <NavLink to={item.href} end={item.href === "/"}>
        {({ isActive }) => (
          <Flex
            w="full"
            align="center"
            gap={3}
            px={4}
            py={2.5}
            rounded="lg"
            cursor="pointer"
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            bg={isActive ? "sidebar.activeBg" : "transparent"}
            color={isActive ? "sidebar.textActive" : "sidebar.text"}
            fontWeight={isActive ? "semibold" : "medium"}
            _hover={{
              bg: isActive ? "sidebar.activeBg" : "sidebar.hover",
              color: "sidebar.textActive",
            }}
            fontSize="sm"
            textAlign="left"
            textDecoration="none"
          >
            <Icon boxSize={5}>
              <item.icon />
            </Icon>
            <Text flex={1}>{item.name}</Text>
          </Flex>
        )}
      </NavLink>
    </Box>
  );
};

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar = ({ isOpen = true }: SidebarProps) => {
  return (
    <Box
      as="aside"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={{ base: isOpen ? "260px" : "0", md: "260px" }}
      bg="sidebar.bg"
      borderRightWidth="1px"
      borderColor="sidebar.border"
      transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      overflow="hidden"
      zIndex={100}
    >
      <Flex
        h="70px"
        px={5}
        align="center"
        borderBottomWidth="1px"
        borderColor="sidebar.border"
      >
        <Flex align="center" gap={3}>
          <Flex
            w={10}
            h={10}
            align="center"
            justify="center"
            rounded="xl"
            bgGradient="to-br"
            gradientFrom="brand.400"
            gradientTo="brand.600"
            shadow="lg"
          >
            <Icon boxSize={6} color="white">
              <Zap />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="white"
              fontFamily="heading"
              letterSpacing="tight"
            >
              DataFlow
            </Text>
            <Text fontSize="xs" color="sidebar.text" mt={-0.5}>
              Analytics Platform
            </Text>
          </Box>
        </Flex>
      </Flex>

      <VStack
        gap={1}
        px={3}
        py={4}
        align="stretch"
        h="calc(100vh - 70px)"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-slate-700)",
            borderRadius: "4px",
          },
        }}
      >
        {navItems.map((item) => (
          <SidebarItem key={item.href} item={item} />
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
