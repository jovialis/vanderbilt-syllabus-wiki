/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import {
    Box,
    Button,
    Code,
    Container,
    Flex,
    Heading,
    HStack,
    Link,
    Text,
    useBreakpointValue,
    VStack
} from "@chakra-ui/react";
import Google from "../assets/google.svg";

export interface LayoutComponentProps {
    marginElement?: JSX.Element,
    children: JSX.Element
}

export function LayoutComponent(props: LayoutComponentProps) {
    const footerSpacing = useBreakpointValue({base: 5, md: 10});

    return <>
        <VStack minH={"100vh"} alignItems={"stretch"} spacing={0}>
            <Box flexGrow={0} py={10} bg={"orange"}>
                <Container maxW={"container.xl"}>
                    <HStack justifyContent={"space-between"}>
                        <VStack alignItems={"flex-start"}>
                            <Link href={'/'} textDecoration={"none"} outline={"none"}>
                                <Heading size={"lg"}>
                                    Syllabus Wiki
                                </Heading>
                            </Link>
                            <Code variant={"outline"} colorScheme={"blackAlpha"} color={"black"}>
                                Vanderbilt University
                            </Code>
                        </VStack>
                        <HStack>
                            <Button className={'login_button'} variant={"outline"} color={"black"} borderColor={"black"}
                                    sx={{
                                        "&:not(:hover) path": {
                                            fill: "black"
                                        },
                                        "& path": {
                                            transition: "0.3s fill"
                                        }
                                    }}>
                                <Box mr={2}>
                                    <Google/>
                                </Box>
                                Login with VU Mail
                            </Button>
                        </HStack>
                    </HStack>
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
                        <HStack spacing={footerSpacing}>
                            <Link href={"https://github.com/jovialis?tab=repositories"}>
                                GitHub
                            </Link>
                            <Link>
                                Powered by Vercel
                            </Link>
                        </HStack>
                    </HStack>

                </Container>
            </Box>
        </VStack>
    </>
}