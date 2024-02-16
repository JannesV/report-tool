import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  ChakraProvider,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { v4 } from "uuid";
import { CategoryType, ReportCategoryDto } from "./types";

export const App = () => {
  const [categories, setCategories] = useState<ReportCategoryDto[]>([]);

  const handleRootChangeCategory = (
    index: number,
    newValue?: ReportCategoryDto
  ) => {
    const temp = [...categories];

    if (newValue) {
      temp[index] = newValue;
    } else {
      temp.splice(index, 1);
    }

    setCategories(temp);
  };

  const renderCategory = (
    cats: ReportCategoryDto[],
    handleChangeCategory: (index: number, newValue?: ReportCategoryDto) => void
  ) => {
    return cats.map((cat, catIndex) => {
      return (
        <AccordionItem isFocusable={false} key={cat.id}>
          <Center bg="blackAlpha.200">
            <AccordionButton gap={4}>
              <Text flex={1} textAlign="left">
                {cat.name}
              </Text>
              <Popover placement="left">
                <PopoverTrigger>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<DeleteIcon />}
                    aria-label="delete"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody
                    flexDir="column"
                    display="flex"
                    alignItems="flex-end"
                  >
                    <Text fontSize="xs">
                      Ben je zeker dat je deze categorie wil verwijderen?
                    </Text>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeCategory(catIndex, undefined);
                      }}
                      w={20}
                      mt={2}
                      size="xs"
                      colorScheme="red"
                    >
                      Ja
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <AccordionIcon />
            </AccordionButton>
          </Center>

          <AccordionPanel
            bg="blackAlpha.50"
            gap={5}
            display="flex"
            flexDir="column"
          >
            <Grid
              gap={5}
              p={4}
              mt={2}
              border="1px"
              borderColor="blackAlpha.300"
              borderRadius="lg"
            >
              <Box flex={1}>
                <FormLabel>Categorien Naam</FormLabel>
                <Input
                  onChange={(e) => {
                    handleChangeCategory(catIndex, {
                      ...cat,
                      name: e.currentTarget.value,
                    });
                  }}
                  value={cat.name}
                />
              </Box>

              <Box>
                <FormLabel>Categorie Type</FormLabel>
                <Select
                  onChange={(e) => {
                    const value = e.currentTarget.value as CategoryType;

                    handleChangeCategory(catIndex, {
                      ...cat,
                      type: value || undefined,
                      fallback:
                        value === CategoryType.EXTERNAL
                          ? cat.fallback
                          : undefined,
                      to: value === CategoryType.MAIL ? cat.to : undefined,
                    });
                  }}
                  w={250}
                  placeholder="Erf over van ouder"
                >
                  <option value={CategoryType.MAIL}>Email</option>
                  <option value={CategoryType.EXTERNAL}>Extern</option>
                </Select>
              </Box>

              {cat.type === CategoryType.EXTERNAL && (
                <Box flex={1}>
                  <FormLabel>Link</FormLabel>
                  <Input
                    onChange={(e) => {
                      handleChangeCategory(catIndex, {
                        ...cat,
                        fallback: e.currentTarget.value || undefined,
                      });
                    }}
                    value={cat.to}
                  />
                </Box>
              )}

              {cat.type === CategoryType.MAIL && (
                <Box flex={1}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    onChange={(e) => {
                      handleChangeCategory(catIndex, {
                        ...cat,
                        to: e.currentTarget.value || undefined,
                      });
                    }}
                    value={cat.fallback}
                  />
                </Box>
              )}
            </Grid>

            <Accordion allowMultiple borderRadius="lg" overflow="hidden">
              {cat.subCategories &&
                renderCategory(
                  cat.subCategories,
                  (index: number, newValue?: ReportCategoryDto) => {
                    const temp = [...cat.subCategories!];

                    if (newValue) {
                      temp[index] = newValue;
                    } else {
                      temp.splice(index, 1);
                    }

                    handleChangeCategory(catIndex, {
                      ...cat,
                      subCategories: temp,
                    });
                  }
                )}
            </Accordion>

            <Button
              size={"xs"}
              colorScheme="green"
              onClick={() => {
                const newCat: ReportCategoryDto = {
                  id: v4(),
                  name: "Nieuwe subcategorie",
                };
                handleChangeCategory(catIndex, {
                  ...cat,
                  subCategories: cat.subCategories
                    ? [...cat.subCategories, newCat]
                    : [newCat],
                });
              }}
              leftIcon={<AddIcon />}
            >
              Subcategorie toevoegen
            </Button>
          </AccordionPanel>
        </AccordionItem>
      );
    });
  };

  return (
    <ChakraProvider>
      <Box shadow="lg" borderRadius="lg" m={10} p={10}>
        <Accordion allowMultiple w={800} borderRadius="lg" overflow="hidden">
          {renderCategory(categories, handleRootChangeCategory)}
        </Accordion>

        <Button
          onClick={() => {
            setCategories([
              ...categories,
              {
                id: v4(),
                name: "Nieuwe categorie",
              },
            ]);
          }}
          leftIcon={<AddIcon />}
          mt={4}
          colorScheme="green"
          size="xs"
        >
          Categorie toevoegen
        </Button>

        <Textarea
          fontFamily="monospace"
          placeholder="OUTPUT JSON"
          value={JSON.stringify(categories, null, 2)}
          size="sm"
          h={400}
          mt={10}
          readOnly
        />
      </Box>
    </ChakraProvider>
  );
};
