describe("Project Tiles Interaction Test", () => {
    beforeEach(() => {
      cy.visit("http://localhost:4321"); // Replace with your component's route if necessary
    });
  
    it("should render all project tiles", () => {
      cy.get("article.project-tile").should("have.length", 4);
    });
  
    it("should dynamically adjust color percentage on mousemove", () => {
      cy.get("article.project-tile").first().trigger("mousemove", {
        clientX: 50, // Example coordinates
        clientY: 50,
      });
  
      cy.get("article.project-tile")
        .first()
        .should(($tile) => {
          const lightBluePercent = $tile[0].style.getPropertyValue("--lightBluePercent");
          expect(lightBluePercent).to.not.be.empty;
        });
    });
  
    it("should expand the gradient on hover", () => {
      cy.get("article.project-tile")
        .first()
        //@ts-ignore
        .realHover()
        .should("have.css", "width", "100%");
    });
  });
  