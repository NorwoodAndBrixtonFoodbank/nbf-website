"use client";

import React, { ReactElement } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Supabase } from "@/supabaseUtils";
import { DbWikiRow } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { useState, useEffect } from 'react';
import { use } from "chai";

const getTopWikiRow = async (supabase: Supabase) : Promise<DbWikiRow> => {
  const query = await supabase
  .from('wiki')
  .select('*')
  .limit(1)
  .single() as {
      data: DbWikiRow;
      error: Error | null;
  };

  if(query.error) {throw query.error}
  return query.data;
}

const InfoPage: React.FC = () => { 
  const [topRow, setTopRow] : [DbWikiRow, (a : DbWikiRow) => void] = useState({title: '', content: '', order: -1})
  useEffect(() => {const fetchData = async () => {
    const temp: DbWikiRow = await getTopWikiRow(supabase);
    setTopRow(temp)}
    fetchData();
    }, []);
  const topRowContentParts = topRow.content.split(/(\[.*\]\(.*\)|<.*>)/);
  const formattedContent = topRowContentParts.map( (part, index) => {
    if (index % 2 === 1) {
      const plainPart = part.slice(1,-1);
      if(plainPart.includes("](")) {
        const items = plainPart.split(/\]\(/)
        return <a href={items[1]} key={index}>{items[0]}</a>
      } else {
        return <a href={plainPart} key={index}>{plainPart}</a>
      }
    } else {
      return part;
    }
  });

  return (
    <>
      {(topRow.order !== -1) &&
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {topRow.title}
        </AccordionSummary>
        <AccordionDetails>
          {formattedContent}
        </AccordionDetails>
      </Accordion>
      }
    </>
  )
};

export default InfoPage