# Using LangExtract for storing unstructeured metadata into database for more context aware retrival augmented system but it does requires the gemini api key

import os
import textwrap
import re
from typing import List, Dict
from dotenv import load_dotenv

GEMINI_API_KEY = "AIzaSyDSof62SAJLPa4Nk2lPOe-LEGJR_5ie4Ns"

load_dotenv()

# Need sample data from main.py

# Processing


class FixedLangExtractProcessor:
    """Enhanced metadata extraction with better prompts and normalization"""

    def __init__(self) -> None:
        try:
            import langextract as lx

            self.lx = lx
            self.setup_complete = True
            print("Lang Extract initialized")
        except ImportError:
            print("Install the langextract brooo...")
            self.setup_complete = False

    def extract_metadata(self, documents: List[Dict]) -> List[Dict]:
        """Extract and normalize metadata"""

        if not self.setup_complete:
            return self._enhanced_regex_extraction(documents)

        """Extraction prompt for suitable extraction of metadata from the research papers"""
        prompt = """ 
            Extract these specific fields for research paper analysis

            1. research_paper_name : the title of research paper
            2. date : the date of publishing the paper or origin of paper 
            3. abstract : the short summary of whole research paper with important keywords 
            4. images : images with their title and importance of that image in that research paper
            5. future_aspect : the unfinished aspects of research paper which can be followed for future reference 

            Be very precise - extract the EXACT name from title
            Be brief - extract summary such that it can be found by relevance of the important keywords 
            Keep track of events - with the publish date keep all track of other events which made impact on research paper 

        """
