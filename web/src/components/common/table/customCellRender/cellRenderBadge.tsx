import { Badge, HStack, } from '@chakra-ui/react';

interface ProductParamsType {
    products: string[];
}

const CellRenderBadge = ( params : ProductParamsType )=> {
    console.log(params.products)
  return (  
    <HStack flexWrap="wrap" gap={2} marginTop={2}>
      {params.products?.map((product: string) => (
        <Badge key={product} colorScheme="blue" mr={2} >
          {product}
        </Badge>
      ))}
    </HStack>
  );
};

export default CellRenderBadge;