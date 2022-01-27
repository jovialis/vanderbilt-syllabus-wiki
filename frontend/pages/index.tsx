/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */
import {LayoutComponent} from "../components/layout.component";
import {
    Badge,
    Button,
    Container,
    Flex,
    Link,
    Skeleton,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useBreakpointValue,
    useControllableState,
    VStack
} from "@chakra-ui/react";
import {AttachmentIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {SearchSectionWithTerm, UploadPopoverComponent} from "../components/uploadPopover.component";
import {SearchbarComponent} from "../components/searchbar.component";
import {useRouter} from "next/router.js";
import {useEffect, useState} from "react";
import {useFetch} from "../utils/useFetch.util";
import {AxiosRequestConfig} from "axios";
import {SearchSectionTerm} from "../types/section.type";
import Trekking from "../assets/trekking.svg";
import Vacation from "../assets/vacation.svg";

export default function IndexPage() {
    const router = useRouter();

    const showTitle = useBreakpointValue({base: false, md: true});
    const showTerm = useBreakpointValue({base: false, lg: true});

    /**
     * Represents the currently displayed data for the page
     */
    const [initialState, setInitialState] = useState<boolean>(true);
    const [curPage, setCurPage] = useState<number>(1);
    const [pageData, setPageData] = useState<SearchSectionTerm[]>([]);

    /**
     * Data fetching
     */
    const [curSearchRequest, setCurSearchRequest] = useState<AxiosRequestConfig | undefined>(undefined);
    const {loading: searchLoading, data: searchFetchData} = useFetch<{ terms: SearchSectionTerm[] }>(curSearchRequest, {
        onData: (data: { terms: SearchSectionTerm[] }) => {
            setPageData(data.terms);
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });

    const [curPaginateRequest, setCurPaginateRequest] = useState<AxiosRequestConfig | undefined>(undefined);
    const {
        loading: paginateLoading,
        data: paginateFetchData
    } = useFetch<{ terms: SearchSectionTerm[] }>(curPaginateRequest, {
        onData: (data: { terms: SearchSectionTerm[] }) => {
            setPageData([
                ...pageData,
                ...data.terms
            ]);
            setCurPage(curPage + 1);
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });

    /**
     * Control for the Search bar
     */
    const [lastSearchTerm, setLastSearchTerm] = useState<string>('');
    const [searchTerm, setControlledSearchTerm] = useControllableState({defaultValue: ''});

    /**
     * Middleware to handle updating the Browser address with the current search term.
     */
    function setSearchTerm(term: string) {
        // Update to the Router.
        router.replace({
            pathname: router.pathname,
            query: term.trim().length > 0 ? {
                query: term
            } : null
        }, undefined, {
            shallow: true
        });

        setControlledSearchTerm(term);
    }

    /**
     * Load search state from URL
     */
    useEffect(() => {
        if (router.isReady && router.query.query && router.query.query.length > 0) {
            setControlledSearchTerm(String(router.query.query));
            search(String(router.query.query)); // Search to preload results.
        }
    }, [router.isReady]);

    /**
     * Function to execute the search
     */
    function search(query: string) {
        const validSearch = query.trim().length > 0;
        setInitialState(!validSearch);

        setCurPage(1); // Reset back to first page
        setLastSearchTerm(query);

        setPageData([]);

        setCurSearchRequest({
            method: 'get',
            baseURL: process.env['NEXT_PUBLIC_BACKEND_URL'],
            url: '/search',
            params: {
                query
            }
        });
    }

    /**
     * Function to load a second page
     */
    function nextPage() {
        if (paginateLoading)
            return;

        setCurPaginateRequest({
            method: 'get',
            baseURL: process.env['NEXT_PUBLIC_BACKEND_URL'],
            url: '/search',
            params: {
                query: lastSearchTerm,
                page: curPage + 1
            }
        });
    }

    /**
     * Handle the add Syllabus dialogue.
     */
    const [addSyllabusSection, setAddSyllabusSection] = useState<SearchSectionWithTerm | null>(null);

    return <LayoutComponent marginElement={
        <SearchbarComponent value={searchTerm} setValue={setSearchTerm} onSearch={search}/>
    }>
        <Container
            maxW={"container.xl"}
            my={5}
        >
            <UploadPopoverComponent section={addSyllabusSection} setSection={setAddSyllabusSection}/>
            {(!initialState && !searchLoading && pageData.length === 0) && <>
                <VStack spacing={0}>
                    <Trekking style={{
                        width: "500px",
                        maxWidth: "75%"
                    }}/>
                    <Text size={"md"} color={"gray.500"}>
                        Welp... This is awkward. It looks like we don't have that course.
                    </Text>
                </VStack>
            </>}

            {(!initialState && !searchLoading && pageData.length > 0) && <>
                <Table
                    variant='simple'
                    colorScheme={"blackAlpha"}
                    bg={"white"}
                >
                    <Thead>
                        <Tr>
                            {showTerm && <Th isNumeric>Term</Th>}
                            {showTitle && <Th>Course</Th>}
                            <Th isNumeric={false}>Section</Th>
                            <Th isNumeric={false}>Professor</Th>
                            <Th isNumeric>Syllabus</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {pageData.map(t => <>
                            <Tr>
                                <Th color={"gray.400"} whiteSpace={"nowrap"} isNumeric={showTerm}>{t.id}</Th>
                                {showTitle && <Th/>}
                                {showTerm && <Th/>}
                                <Th/>
                                <Th/>
                            </Tr>
                            {t.courses.map(c => <>
                                {c.sections.map((s => <>
                                    <Tr>
                                        {showTerm && <Td/>}
                                        {showTitle && <Td><Text wordBreak={"break-word"}>{c.name}</Text></Td>}
                                        <Td><Badge
                                            whiteSpace={showTitle ? "nowrap" : undefined}>{s.abbreviationFull}</Badge></Td>
                                        <Td>
                                            {s.professors.map(p => {
                                                const split = (p + ',').split(',');
                                                return `${split[1].trim()} ${split[0].trim()}`
                                            }).join(', ')}
                                        </Td>
                                        <Td isNumeric>{s.syllabi.length > 0 ? <>
                                            <Link href={`/file/${s.syllabi[0].id}`} target={"_blank"}
                                                  color={"orange.500"}>
                                                {showTitle ? 'View Syllabus' : 'View'}
                                                <ExternalLinkIcon ml={2}/>
                                            </Link>
                                        </> : <>
                                            <Button
                                                size={"xs"}
                                                leftIcon={<AttachmentIcon/>}
                                                onClick={() => {
                                                    setAddSyllabusSection({
                                                        ...s,
                                                        term: t.id
                                                    });
                                                }}
                                            >
                                                {showTitle ? 'Upload Syllabus' : 'Upload'}
                                            </Button>
                                        </>}</Td>
                                    </Tr>
                                </>))}
                            </>)}
                        </>)}
                    </Tbody>
                </Table>
                <Flex justifyContent={"center"} mt={10}>
                    <Button
                        onClick={nextPage}
                        isLoading={paginateLoading}
                        loadingText={'Loading...'}
                        colorScheme={"orange"}
                    >
                        Load More
                    </Button>
                </Flex>
            </>}


            {(router.isReady && initialState) && <>
                <VStack spacing={0}>
                    <Vacation style={{
                        width: "500px",
                        maxWidth: "75%"
                    }}/>
                    <Text size={"md"} color={"gray.500"}>
                        Get started! Try searching for a course you're interested in.
                    </Text>
                </VStack>
            </>}
            {(!initialState && searchLoading && !searchFetchData) && <>
                <Stack spacing={8} mt={5}>
                    {Array.from(Array(5).keys()).map(() => <>
                        <Skeleton height={3}/>
                    </>)}
                </Stack>
            </>}
        </Container>
    </LayoutComponent>
}