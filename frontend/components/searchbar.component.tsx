/**
 * Created by jovialis (Dylan Hanson) on 1/26/22.
 */

import {Box, Button, HStack, Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {Dispatch, useState} from "react";

export interface SearchbarComponentProps {
    value: string
    setValue: Dispatch<string>
    onSearch: Dispatch<string>
}

export function SearchbarComponent(props: SearchbarComponentProps) {
    const placeholders = ["Global History of Waste", "CS 2201", "Biology Today", "HIST 2139"];
    const [placeholderIndex, setPlaceholderIndex] = useState<number>(Math.floor(Math.random() * placeholders.length));

    return <>
        <HStack spacing={3} align={"center"}>
            <Box flexGrow={1}>
                <InputGroup size={"lg"} variant={"outline"}>
                    <InputLeftElement pointerEvents='none'>
                        <SearchIcon color='gray.300'/>
                    </InputLeftElement>
                    <Input
                        bg={"white"}
                        boxShadow={"md"}
                        value={props.value}
                        placeholder={placeholders[placeholderIndex]}
                        onChange={e => props.setValue(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                props.onSearch(props.value);
                            }
                        }}
                    />
                </InputGroup>
            </Box>
            <Box>
                <Button
                    size={"lg"}
                    colorScheme={"orange"}
                    boxShadow={"md"}
                    onClick={() => {
                        props.onSearch(props.value)
                    }}
                >
                    Search
                </Button>
            </Box>
        </HStack>
    </>
}