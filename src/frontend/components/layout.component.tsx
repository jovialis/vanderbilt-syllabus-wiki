/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import {Badge, Box, Container, Flex, Heading, Link, Stack, Text, VStack} from "@chakra-ui/react";
import {ExportUser, LoginButton} from "./loginButton.component";
import {Dispatch} from "react";
import Head from "next/head.js";
import Github from "../assets/github.svg";
import Vercel from "../assets/vercel.svg";
import {Icon} from "@chakra-ui/icons";

export interface LayoutComponentProps {
    marginElement?: JSX.Element,
    children: JSX.Element,
    updateUser: Dispatch<ExportUser | null>
}

export function LayoutComponent(props: LayoutComponentProps) {
    return <>
        <Head>
            <title>Syllabus Wiki: Vanderbilt</title>
            <meta name="title" content="Syllabus Wiki: Vanderbilt University"/>
            <meta name="description" content="Free and open source syllabus repository for Vanderbilt University"/>
            <meta name="keywords"
                  content="syllabus,course,vanderbilt,university,vu,course,upload,free,repository,list"/>
            <meta name="robots" content="index, nofollow"/>
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
            <meta name="language" content="English"/>
            <meta name="author" content="Dylan Hanson (jovialis)"/>
        </Head>
        <VStack minH={"100vh"} alignItems={"stretch"} spacing={0} overflow={"hidden"}>
            <Box flexGrow={0} py={10} pt={[5, 10]} bg={"orange"}>
                <Container maxW={"container.xl"}>
                    <Stack spacing={[6, 0]} justifyContent={"space-between"}
                           direction={["column", "row"]}>
                        <Stack alignItems={"flex-start"}
                               direction={"column"}>
                            <Link href={'/'} sx={{
                                "&:hover": {
                                    textDecoration: "none"
                                }
                            }}>
                                <Heading as={"h1"} size={"xl"}>
                                    Syllabus Wiki
                                </Heading>
                            </Link>

                            <Badge variant={"outline"} colorScheme={"blackAlpha"} color={"black"}>
                                Vanderbilt University
                            </Badge>
                        </Stack>
                        <Box>
                            <LoginButton updateUser={props.updateUser}/>
                        </Box>
                    </Stack>
                </Container>
                {props.marginElement && <>
                    <Container maxW={"container.xl"}>
                        <Flex pos={"relative"} alignItems={"stretch"}>
                            <Box pos={"absolute"} top={25} width={"100%"}>
                                {props.marginElement}
                            </Box>
                        </Flex>
                    </Container>
                </>}
            </Box>
            <Box flexGrow={1} bg={"gray.50"} py={15} pb={75}>
                <Box pt={props.marginElement && 35}>
                    {props.children}
                </Box>
            </Box>
            <Box flexGrow={0} bg={"gray.100"} py={5} pt={8}>
                <Container maxW={"container.lg"} flexGrow={0}>
                    <VStack spacing={5} alignItems={"stretch"}>
                        <Stack direction={["column", "row"]} alignItems={["flex-start", "center"]}
                               justifyContent={"space-between"} spacing={[5, 0]}>
                            <VStack alignItems={"flex-start"}>
                                <Heading size={"md"}>
                                    Syllabus Wiki
                                </Heading>
                                <Badge color={"gray.500"} bg={"clear"} p={0}>
                                    Created with {`<3`} at Vanderbilt University
                                </Badge>
                            </VStack>
                            <Stack spacing={5} alignItems={"center"} direction={["row", "row-reverse"]}>
                                <Link
                                    href={"https://github.com/jovialis/vanderbilt-syllabus-wiki"}
                                    target={"_blank"}
                                    sx={{
                                        "& svg": {
                                            transition: "0.2s fill"
                                        },
                                        "&:hover svg": {
                                            fill: "gray.600"
                                        }
                                    }}
                                >
                                    <Icon
                                        fill={"gray.500"}
                                        as={Github}
                                        h={25}
                                        w={"auto"}
                                    />
                                </Link>
                                <Link href={"https://vercel.com/"}
                                      target={"_blank"}
                                      sx={{
                                          "& svg": {
                                              transition: "0.2s fill"
                                          },
                                          "&:hover svg": {
                                              fill: "gray.600"
                                          }
                                      }}
                                >
                                    <Icon fill={"gray.500"} h={15} w={"auto"} as={Vercel}/>
                                </Link>
                            </Stack>
                        </Stack>
                        <Text fontSize={"xs"} color={"gray.400"}
                              textAlign={["start", "center"]}>Copyright {(new Date()).getFullYear()}, Dylan
                            Hanson</Text>
                    </VStack>
                </Container>
            </Box>
        </VStack>
    </>
}