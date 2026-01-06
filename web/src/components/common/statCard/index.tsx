import { Card, Icon, Heading, VStack, Flex, Text } from "@chakra-ui/react";

interface StatCardProps {
    title: string;
    value: string;

    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
  }
  
const StatCard = ({ title, value, icon: IconComponent, iconColor, iconBg }: StatCardProps) => {
    
    return (
      <Card.Root
        bg={{ _light: "white", _dark: "gray.800" }}
        shadow="sm"
        rounded="xl"
        border="none"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      >
        <Card.Body p={6}>
          <Flex justify="space-between" align="start">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                {title}
              </Text>
              <Heading size="2xl" fontWeight="bold" fontFamily="heading">
                {value}
              </Heading>
            </VStack>
            <Flex
              w={12}
              h={12}
              align="center"
              justify="center"
              rounded="xl"
              bg={iconBg}
            >
              <Icon boxSize={6} color={iconColor}>
                <IconComponent />
              </Icon>
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>
    );
  };

export default StatCard;