/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */
import {LayoutComponent} from "../components/layout.component";
import {
    Badge,
    Box,
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
import Trekking from "../assets/trekking.svg";
import Vacation from "../assets/vacation.svg";
import {ExportUser} from "../components/loginButton.component";
import {combineSearchResults} from "../helpers/combineSearchResults";
import {APISearchResponse, APITerm} from "shared";

export default function IndexPage() {
    const router = useRouter();

    /**
     * Whether or not the User is logged in
     */
    const [user, setUser] = useState<ExportUser | null>(null);

    const showTitle = useBreakpointValue({base: false, md: true});
    const showTerm = useBreakpointValue({base: false, lg: true});

    /**
     * Represents the currently displayed data for the page
     */
    const [initialState, setInitialState] = useState<boolean>(true);
    const [curPage, setCurPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [pageData, setPageData] = useState<APITerm[]>([]);

    /**
     * Data fetching
     */
    const [curSearchRequest, setCurSearchRequest] = useState<AxiosRequestConfig | undefined>(undefined);
    const {loading: searchLoading, data: searchFetchData} = useFetch<APISearchResponse>(curSearchRequest, {
        onData: (data: APISearchResponse) => {
            setPageData(data.data);
            setHasNextPage(data.pagination.hasNext);
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });

    const [curPaginateRequest, setCurPaginateRequest] = useState<AxiosRequestConfig | undefined>(undefined);
    const {
        loading: paginateLoading,
        data: paginateFetchData
    } = useFetch<APISearchResponse>(curPaginateRequest, {
        onData: (data: APISearchResponse) => {
            const combinedData: APITerm[] = combineSearchResults(pageData, data.data);
            setPageData(combinedData);
            setCurPage(curPage + 1);
            setHasNextPage(data.pagination.hasNext);
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

    // @ts-ignore
    return <LayoutComponent
        marginElement={
            <SearchbarComponent value={searchTerm} setValue={setSearchTerm} onSearch={search}/>
        }
        updateUser={setUser}
    >
        <Container
            maxW={"container.xl"}
            my={5}
        >
            <UploadPopoverComponent section={addSyllabusSection} setSection={setAddSyllabusSection}/>
            {(!initialState && !searchLoading && pageData.length === 0) && <>
                <VStack spacing={0} alignItems={"center"}>
                    <Trekking style={{
                        width: "500px",
                        maxWidth: "75%"
                    }}/>
                    <Text color={"gray.500"} textAlign={"center"}>
                        Welp... This is awkward. It looks like we {"don't"} have that course.
                    </Text>
                </VStack>
            </>}

            {(!initialState && !searchLoading && pageData.length > 0) && <>
                <Box overflow={"scroll"}>
                    <Table
                        size={showTitle ? "md" : "sm"}
                        colorScheme={"blackAlpha"}
                        bg={"white"}
                    >
                        <Thead>
                            <Tr>
                                {showTerm && <Th>Term</Th>}
                                <Th>Course</Th>
                                <Th isNumeric={false}>Section</Th>
                                <Th isNumeric={false}>Professor</Th>
                                <Th isNumeric>Syllabus</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {pageData.map(t => <>
                                <Tr pos={"sticky"}>
                                    <Th color={"gray.400"} whiteSpace={"nowrap"}>{t.id}</Th>
                                    <Th/>
                                    {showTerm && <Th/>}
                                    <Th/>
                                    <Th/>
                                </Tr>
                                {t.courses.map(c => <>
                                    {c.sections.map((s => <>
                                        <Tr>
                                            {showTerm && <Td/>}
                                            <Td><Text>{c.name}</Text></Td>
                                            <Td><Badge
                                                whiteSpace={"nowrap"}>{s.abbreviationFull}</Badge></Td>
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
                                                {user ? <>
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
                                                </> : <>
                                                    <Badge
                                                        size={"xs"}
                                                        leftIcon={<AttachmentIcon/>}
                                                    >
                                                        {showTitle ? 'Not Available' : 'None'}
                                                    </Badge>
                                                </>}
                                            </>}</Td>
                                        </Tr>
                                    </>))}
                                </>)}
                            </>)}
                        </Tbody>
                    </Table>
                </Box>
                {hasNextPage && <>
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
            </>}


            {(router.isReady && initialState) && <>
                <VStack spacing={0} alignItems={"center"}>
                    <Vacation style={{
                        width: "500px",
                        maxWidth: "75%"
                    }}/>
                    <Text color={"gray.500"} textAlign={"center"}>
                        Get started! Try searching for a course {"you're"} interested in.
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