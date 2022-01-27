/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import {Box, Code, Container, Flex, Heading, HStack, Link, Stack, Text, VStack} from "@chakra-ui/react";
import {ExportUser, LoginButton} from "./loginButton.component";
import {Dispatch} from "react";
import Head from "next/head.js";

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
        <VStack minH={"100vh"} alignItems={"stretch"} spacing={0}>
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
                                <Heading size={"lg"}>
                                    Syllabus Wiki
                                </Heading>
                            </Link>

                            <Code variant={"outline"} colorScheme={"blackAlpha"} color={"black"}>
                                Vanderbilt University
                            </Code>
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
            <Box flexGrow={0} bg={"gray.100"} py={8} pb={10}>
                <Container maxW={"container.xl"} flexGrow={0}>
                    <HStack alignItems={"center"} justifyContent={"space-between"}>
                        <VStack alignItems={"flex-start"}>
                            <Heading size={"md"}>
                                Syllabus Wiki
                            </Heading>
                            <Text color={"gray.500"}>
                                Created with {`<3`} by Dylan Hanson
                            </Text>
                        </VStack>
                        <HStack spacing={[5, 10]}>
                            <Link href={"https://github.com/jovialis/vanderbilt-syllabus-wiki"}>
                                View on GitHub
                            </Link>
                        </HStack>
                    </HStack>

                </Container>
            </Box>
        </VStack>
    </>
}