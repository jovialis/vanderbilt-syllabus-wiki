/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    Tag,
    TagCloseButton,
    TagLabel,
    TagLeftIcon,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {SearchSection} from "../helpers/combineSearchResults.js";
import {AttachmentIcon} from "@chakra-ui/icons";
import {ChangeEvent, Dispatch, useEffect, useRef, useState} from "react";
import {AxiosRequestConfig} from "axios";
import {useRouter} from "next/router.js";
import {useFetch} from "../utils/useFetch.util";

export interface SearchSectionWithTerm extends SearchSection {
    term: string
}

export interface UploadPopoverComponentProps {
    section: SearchSectionWithTerm | null,
    setSection: Dispatch<SearchSectionWithTerm | null>
}

export function UploadPopoverComponent(props: UploadPopoverComponentProps) {
    const router = useRouter();

    const {onOpen, onClose, isOpen} = useDisclosure();

    const hiddenFileInput = useRef(null);

    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);

    // Open/close based on the section prop
    useEffect(() => {
        if (props.section) {
            onOpen();
        } else {
            onClose();
            setFile(null);

            if (success) {
                router.reload();
            }

            setSuccess(false);
        }
    }, [props.section]);

    // Manually closes the dialogue by setting the section to none.
    function close() {
        props.setSection(null);
    }

    // Handles the selection of a file
    function handleFile(event: ChangeEvent) {
        // @ts-ignore
        const fileUploaded = event.target?.files[0];
        setFile(fileUploaded);
    }


    const [uploadRequest, setUploadRequest] = useState<AxiosRequestConfig | undefined>(undefined);
    const {loading} = useFetch<any>(uploadRequest, {
        onData: () => {
            setSuccess(true);
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });

    function upload() {
        if (!props.section)
            return;

        if (!file)
            return;

        const formData = new FormData();
        formData.append('section', props.section.id);
        formData.append('file', file);

        setUploadRequest({
            method: 'post',
            url: '/upload',
            data: formData,
            headers: {"Content-Type": "multipart/form-data"}
        });
    }

    // @ts-ignore
    return <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>
                Upload Syllabus
            </ModalHeader>
            <ModalCloseButton onClick={close}/>
            <Table mb={2}>
                <Thead>
                    <Tr>
                        <Th>Term</Th>
                        <Th>Section</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Th><Text color={"gray.400"}>{props.section?.term}</Text></Th>
                        <Td><Badge whiteSpace={"nowrap"}>{props.section?.abbreviationFull}</Badge></Td>
                    </Tr>
                </Tbody>
            </Table>
            {success ? <>
                <ModalBody>
                    <Alert
                        status={'success'}
                        variant={'subtle'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        textAlign={'center'}
                        height={200}
                    >
                        <AlertIcon boxSize='40px' mr={0}/>
                        <AlertTitle mt={4} mb={1} fontSize={'lg'}>
                            Syllabus Submitted!
                        </AlertTitle>
                        <AlertDescription maxWidth={'sm'}>
                            Thanks for helping your peers. They really appreciate your contribution.
                        </AlertDescription>
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={close}>
                        Close
                    </Button>
                </ModalFooter>
            </> : <>
                <ModalBody>
                    {file ? <>
                        <Tag
                            size={"lg"}
                            variant={'subtle'}
                            colorScheme={'orange'}
                        >
                            <TagLeftIcon as={AttachmentIcon}/>
                            <TagLabel>{file.name}</TagLabel>
                            <TagCloseButton onClick={() => {
                                setFile(null);
                            }}/>
                        </Tag>
                    </> : <>
                        <Button variant={"ghost"} h={150} w={"100%"} bg={"gray.100"} colorScheme={'gray'}
                                onClick={() => {
                                    // @ts-ignore
                                    hiddenFileInput?.current?.click();
                                }}>
                            <VStack spacing={2}>
                                <AttachmentIcon h={30} w={30} color={"gray.500"}/>
                                <Text color={"gray.500"}>
                                    Select PDF
                                </Text>
                            </VStack>
                        </Button>
                        <input
                            type="file"
                            accept={"application/pdf"}
                            ref={hiddenFileInput}
                            onChange={handleFile}
                            style={{display: 'none'}}
                        />
                    </>}
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={3}>
                        <Button onClick={close}>
                            Close
                        </Button>
                        <Button
                            colorScheme={"orange"}
                            disabled={!file || loading}
                            onClick={upload}
                            loadingText={"Uploading..."}
                            isLoading={loading}
                        >
                            Upload
                        </Button>
                    </HStack>
                </ModalFooter>
            </>}
        </ModalContent>
    </Modal>
}