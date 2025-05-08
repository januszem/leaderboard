// Race data
const races = [
    "Monaco GP",
    "Silverstone",
    "Monza", 
    "Singapore", 
    "Suzuka"
];

// Driver data with their times (in seconds)
const driversData = {
    mercedes: [
        {
            name: "Lewis Hamilton",
            number: 44,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "George Russell",
            number: 63,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Valtteri Bottas",
            number: 77,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Esteban Ocon",
            number: 31,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Andrea Kimi Antonelli",
            number: 87,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        }
    ],
    redBull: [
        {
            name: "Max Verstappen",
            number: 1,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Sergio Perez",
            number: 11,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Daniel Ricciardo",
            number: 3,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Yuki Tsunoda",
            number: 22,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        },
        {
            name: "Liam Lawson",
            number: 15,
            times: [
                null, // Times will be generated randomly at runtime
                null,
                null,
                null,
                null
            ]
        }
    ]
};

// Team data
const teamsData = [
    {
        name: "Mercedes",
        logo: "https://www.formula1.com/content/dam/fom-website/teams/2023/mercedes.png.transform/2col/image.png",
        cssClass: "mercedes",
        drivers: driversData.mercedes
    },
    {
        name: "Red Bull",
        logo: "https://www.formula1.com/content/dam/fom-website/teams/2023/red-bull-racing.png.transform/2col/image.png",
        cssClass: "redbull",
        drivers: driversData.redBull
    }
];

// Generate random lap times between 1:20.000 and 1:45.999
function generateRandomTime() {
    // Random time between 80 and 105.999 seconds
    const seconds = 80 + Math.random() * 25.999;
    return parseFloat(seconds.toFixed(3));
}

// Format time as minutes:seconds.milliseconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3).padStart(6, '0');
    return `${minutes}:${remainingSeconds}`;
}

// Generate race data
function generateRaceData() {
    // Generate times for each driver in each race
    teamsData.forEach(team => {
        team.drivers.forEach(driver => {
            // Fill in random times for each race
            for (let i = 0; i < races.length; i++) {
                driver.times[i] = generateRandomTime();
            }
            
            // Calculate total time for driver
            driver.totalTime = driver.times.reduce((sum, time) => sum + time, 0);
        });
        
        // Calculate team totals
        team.totalTime = team.drivers.reduce((sum, driver) => sum + driver.totalTime, 0);
    });
    
    // Find best times for each race and team
    races.forEach((race, raceIndex) => {
        teamsData.forEach(team => {
            let bestTime = Infinity;
            team.drivers.forEach(driver => {
                if (driver.times[raceIndex] < bestTime) {
                    bestTime = driver.times[raceIndex];
                }
            });
            
            team.drivers.forEach(driver => {
                driver.bestTimes = driver.times.map((time, idx) => 
                    time === team.drivers.reduce((min, d) => Math.min(min, d.times[idx]), Infinity)
                );
            });
        });
    });
    
    // Determine the winner
    const winner = teamsData.reduce((a, b) => a.totalTime < b.totalTime ? a : b);
    teamsData.forEach(team => {
        team.isWinner = team.name === winner.name;
    });
}

// Render the teams and race data
function renderData() {
    const teamsContainer = document.getElementById('teams-container');
    teamsContainer.innerHTML = '';
    
    teamsData.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = `team ${team.isWinner ? 'winner-team' : ''}`;
        
        // Table with driver positions
        let driverRows = '';
        
        // Sort drivers by their total time for rankings
        const sortedDrivers = [...team.drivers].sort((a, b) => a.totalTime - b.totalTime);
        
        sortedDrivers.forEach((driver, index) => {
            driverRows += `
                <tr>
                    <td>
                        <div class="driver-info">
                            <span class="driver-number">${driver.number}</span>
                            <span class="driver-name">${driver.name}</span>
                        </div>
                    </td>
                    ${driver.times.map((time, idx) => `
                        <td class="${driver.bestTimes[idx] ? 'best-time' : ''}">${formatTime(time)}</td>
                    `).join('')}
                    <td class="driver-total">${formatTime(driver.totalTime)}</td>
                </tr>
            `;
        });
        
        teamElement.innerHTML = `
            <div class="team-header">
                <img src="${team.logo}" alt="${team.name} logo" class="team-logo">
                <h2 class="team-name ${team.cssClass}">${team.name}</h2>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Driver</th>
                        ${races.map(race => `<th>${race}</th>`).join('')}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${driverRows}
                </tbody>
            </table>
            
            <div class="team-total ${team.isWinner ? 'winner' : ''}">
                Total Team Time: ${formatTime(team.totalTime)} ${team.isWinner ? '🏆 WINNERS!' : ''}
            </div>
        `;
        
        teamsContainer.appendChild(teamElement);
    });
    
    // Update results text
    const resultsText = document.getElementById('results-text');
    const winner = teamsData.find(team => team.isWinner);
    const second = teamsData.find(team => !team.isWinner);
    
    const timeDiff = Math.abs(second.totalTime - winner.totalTime);
    
    resultsText.innerHTML = `
        <div class="f1-results">
            <div class="results-card winner-card">
                <div class="position">1</div>
                <div class="team-details">
                    <img src="${winner.logo}" alt="${winner.name}" class="small-logo">
                    <div class="team-name ${winner.cssClass}">${winner.name}</div>
                </div>
                <div class="time-details">
                    <div class="total-time">${formatTime(winner.totalTime)}</div>
                </div>
            </div>
            <div class="results-card">
                <div class="position">2</div>
                <div class="team-details">
                    <img src="${second.logo}" alt="${second.name}" class="small-logo">
                    <div class="team-name ${second.cssClass}">${second.name}</div>
                </div>
                <div class="time-details">
                    <div class="total-time">${formatTime(second.totalTime)}</div>
                    <div class="time-delta">+${formatTime(timeDiff)}</div>
                </div>
            </div>
        </div>
    `;
    
    // Create visualization with D3
    createVisualization();
}

// Create visualization using D3.js
function createVisualization() {
    // Clear previous chart
    d3.select("#chart-container").html("");
    
    const width = document.getElementById('chart-container').clientWidth;
    const isMobile = window.innerWidth <= 800;
    const height = isMobile ? 280 : 350;
    
    // Adjust margins for mobile
    const margin = isMobile 
        ? { top: 30, right: 15, bottom: 70, left: 50 } 
        : { top: 30, right: 30, bottom: 70, left: 80 };
    
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Prepare data for visualization
    const chartData = [];
    teamsData.forEach(team => {
        team.drivers.forEach(driver => {
            driver.times.forEach((time, idx) => {
                chartData.push({
                    team: team.name,
                    driver: driver.name,
                    race: races[idx],
                    time: time,
                    isBest: driver.bestTimes[idx],
                    raceIndex: idx,
                    cssClass: team.cssClass
                });
            });
        });
    });
    
    // X axis
    const x = d3.scaleBand()
        .domain(races)
        .range([0, width - margin.left - margin.right])
        .padding(0.2);
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", isMobile ? "rotate(-35)" : "rotate(-25)")
        .style("font-size", isMobile ? "8px" : "11px");
    
    // Y axis
    const y = d3.scaleLinear()
        .domain([70, d3.max(chartData, d => d.time) + 5])
        .range([height - margin.top - margin.bottom, 0]);
    
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y)
            .tickFormat(d => formatTime(d))
            .ticks(isMobile ? 5 : 8)); // Fewer ticks on mobile
    
    // Add title
    if (!isMobile) {
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", "#15151e")
            .text("Best Lap Times by Race");
    }
    
    // Color scale
    const color = d3.scaleOrdinal()
        .domain(teamsData.map(t => t.name))
        .range(["#00d2be", "#0600ef"]);
    
    // Filter for just the best times for each team
    const bestTimes = chartData.filter(d => d.isBest);
    
    // Add grid lines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-(width - margin.left - margin.right))
            .tickFormat("")
            .ticks(isMobile ? 5 : 8)
        )
        .style("stroke", "#f1f1f1")
        .style("opacity", 0.7);
    
    // Add lines
    const lineGenerator = d3.line()
        .x(d => x(d.race) + x.bandwidth() / 2)
        .y(d => y(d.time))
        .curve(d3.curveMonotoneX);
    
    teamsData.forEach(team => {
        const teamBestTimes = bestTimes.filter(d => d.team === team.name)
            .sort((a, b) => a.raceIndex - b.raceIndex);
        
        svg.append("path")
            .datum(teamBestTimes)
            .attr("fill", "none")
            .attr("stroke", color(team.name))
            .attr("stroke-width", isMobile ? 2 : 3)
            .attr("d", lineGenerator)
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 0.8);
    });
    
    // Add dots
    svg.selectAll("circle")
        .data(bestTimes)
        .join("circle")
        .attr("cx", d => x(d.race) + x.bandwidth() / 2)
        .attr("cy", d => y(d.time))
        .attr("r", 0)
        .attr("fill", d => color(d.team))
        .style("stroke", "#ffffff")
        .style("stroke-width", isMobile ? 1 : 2)
        .transition()
        .delay((d, i) => i * 100)
        .duration(1000)
        .attr("r", isMobile ? 4 : 6);
    
    // Add team names
    if (!isMobile) {
        const lastRace = bestTimes.filter(d => d.raceIndex === 4)
            .sort((a, b) => a.team.localeCompare(b.team));
        
        svg.selectAll(".team-label")
            .data(lastRace)
            .join("text")
            .attr("class", "team-label")
            .attr("x", d => x(d.race) + x.bandwidth() / 2 + 10)
            .attr("y", d => y(d.time))
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", d => color(d.team))
            .style("opacity", 0)
            .text(d => d.team)
            .transition()
            .delay(1500)
            .duration(500)
            .style("opacity", 1);
    }
    
    // Style axes
    svg.selectAll(".x-axis path, .y-axis path")
        .style("stroke", "#ccc");
    
    svg.selectAll(".x-axis line, .y-axis line")
        .style("stroke", "#eee");
        
    svg.selectAll(".x-axis text, .y-axis text")
        .style("fill", "#666")
        .style("font-size", isMobile ? "8px" : "11px");
    
    // Add tooltip functionality
    const tooltip = d3.select("#chart-container")
        .append("div")
        .attr("class", "f1-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(255, 255, 255, 0.95)")
        .style("border", "1px solid #e0e0e0")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "#15151e")
        .style("font-size", isMobile ? "10px" : "12px")
        .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)");
    
    svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", isMobile ? 6 : 9);
            
            tooltip
                .style("visibility", "visible")
                .html(`
                    <div style="font-weight: 700; color: ${color(d.team)};">${d.team}</div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Driver:</span> ${d.driver}
                    </div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Race:</span> ${d.race}
                    </div>
                    <div style="font-weight: 700; margin-top: 5px;">
                        Time: ${formatTime(d.time)}
                    </div>
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", isMobile ? 4 : 6);
            
            tooltip.style("visibility", "hidden");
        });
        
    // Add touch event support for mobile
    if ('ontouchstart' in window) {
        svg.selectAll("circle")
            .on("touchstart", function(event, d) {
                event.preventDefault();
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 6);
                
                tooltip
                    .style("visibility", "visible")
                    .html(`
                        <div style="font-weight: 700; color: ${color(d.team)};">${d.team}</div>
                        <div style="margin: 5px 0;">
                            <span style="font-weight: 600;">Driver:</span> ${d.driver}
                        </div>
                        <div style="margin: 5px 0;">
                            <span style="font-weight: 600;">Race:</span> ${d.race}
                        </div>
                        <div style="font-weight: 700; margin-top: 5px;">
                            Time: ${formatTime(d.time)}
                        </div>
                    `)
                    .style("left", (event.touches[0].pageX + 10) + "px")
                    .style("top", (event.touches[0].pageY - 20) + "px");
            })
            .on("touchend", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 4);
                
                tooltip.style("visibility", "hidden");
            });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateRaceData();
    renderData();
    
    // Add responsive behavior for chart
    window.addEventListener('resize', createVisualization);
});
