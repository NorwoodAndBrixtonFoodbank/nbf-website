"use client";

import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { Button } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

interface CommentProps {
    originalComment: string;
}

const HeaderAndButtonContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 8rem;
    flex-direction: column;
    justify-content: space-between;
    @media (min-width: 800px) {
        width: 15%;
    }
`;

const ConfirmAndCancelButtons = styled(Button)`
    width: 60%;
    max-width: 10rem;
    margin: 0.5rem;
    @media (min-width: 800px) {
        width: 75%;
    }
`;

const Header = styled.p`
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0.5rem;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    background-color: ${(props) => props.theme.main.background[2]};
    border-radius: 1rem;
    margin: 0.5rem;
    padding: 0.5rem;
`;

const CommentBoxContainer = styled.div`
    width: 100%;
    margin: 1rem;
    min-width: 15rem;
    & > * {
        width: 100%;
    }
    @media (min-width: 800px) {
        width: 75%;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 15rem;
    justify-content: space-around;
    @media (min-width: 800px) {
        flex-direction: column;
        align-items: center;
        max-width: 25rem;
    }
`;

const CommentBox = styled(FreeFormTextInput)``;

const CommentContainer: React.FC<CommentProps> = (props) => {
    const [value, setValue] = useState(props.originalComment);
    const onChangeSetValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value);
    };
    const onSubmit = (): void => {
        console.log(value);
    };
    return (
        <Wrapper>
            <HeaderAndButtonContainer>
                <Header>Comments</Header>
                <ButtonContainer>
                    <ConfirmAndCancelButtons
                        variant="outlined"
                        onClick={() => setValue(props.originalComment)}
                    >
                        Reset Changes
                    </ConfirmAndCancelButtons>
                    <ConfirmAndCancelButtons variant="contained" onClick={onSubmit}>
                        Submit Changes
                    </ConfirmAndCancelButtons>
                </ButtonContainer>
            </HeaderAndButtonContainer>
            <CommentBoxContainer>
                <CommentBox
                    value={value}
                    onChange={onChangeSetValue}
                    multiline
                    maxRows={6}
                    minRows={6}
                />
            </CommentBoxContainer>
        </Wrapper>
    );
};

export default CommentContainer;
